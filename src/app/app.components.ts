import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

declare const L: any;

interface Hospital {
  id: number;
  name: string;
  address: string;
  location: [number, number];
  phone?: string;
  website?: string;
  bpjs: boolean;
  igd: boolean;
  type?: string;
  dist_meters?: number; // Jarak dari database
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="font-inter grid h-screen w-full grid-cols-1 md:grid-cols-[380px_1fr]">
      <!-- SIDEBAR -->
      <aside class="flex h-full flex-col bg-gray-50 p-4 shadow-lg md:overflow-y-auto z-20">
        <div class="mb-4">
          <h1 class="text-2xl font-bold text-blue-700">LBS RS Finder</h1>
          <p class="text-xs text-gray-500">Pencarian Rumah Sakit D.I.Y</p>
        </div>

        <!-- 1. KOTAK INFORMASI RS TERDEKAT (Fitur yang kamu minta kembali) -->
        @if (nearestHospital(); as nearest) {
          <div class="mb-4 rounded-lg border border-blue-200 bg-white p-4 shadow-sm animate-fade-in">
            <h3 class="text-sm font-medium text-gray-600">Rumah sakit terdekat dari Anda:</h3>
            <p class="mt-1 text-lg font-bold text-blue-700 leading-tight">
              {{ nearest.name }}
            </p>
            <div class="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <span class="flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-blue-800 font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
                  <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.006.003.002.001.001.001zM10 13a4 4 0 100-8 4 4 0 000 8z" clip-rule="evenodd" />
                </svg>
                {{ (nearest.dist_meters! / 1000) | number:'1.1-1' }} km
              </span>
              <button (click)="onSelectHospital(nearest)" class="text-blue-600 hover:underline text-xs ml-auto">
                Lihat Rute →
              </button>
            </div>
          </div>
        }

        <!-- Search -->
        <div class="relative mb-4">
          <input
            type="text"
            placeholder="Cari nama rumah sakit..."
            (input)="updateSearch($event)"
            class="w-full rounded-lg border border-gray-300 p-2 pl-8 pr-4 shadow-sm focus:border-blue-500 focus:outline-none"
          />
          <span class="absolute left-2 top-2.5 text-gray-400">🔍</span>
        </div>

        <!-- Filter & Radius -->
        <div class="mb-4 space-y-3 rounded-lg bg-white p-3 shadow-sm border border-gray-200">
          <!-- Slider Radius -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="text-xs font-semibold text-gray-700">Jarak Radius:</label>
              <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{{ radiusKm() }} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="0.5"
              [ngModel]="radiusKm()"
              (ngModelChange)="onRadiusChange($event)"
              class="w-full cursor-pointer accent-blue-600 h-1 bg-gray-200 rounded-lg appearance-none"
            />
          </div>

          <div class="h-px bg-gray-100"></div>

          <!-- Checkbox Filter -->
          <div class="grid grid-cols-2 gap-2">
            <label class="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
              <input type="checkbox" (change)="updateFilter('bpjs', $event.target)" class="rounded text-blue-600" />
              <span>Menerima BPJS</span>
            </label>
            <label class="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
              <input type="checkbox" (change)="updateFilter('igd', $event.target)" class="rounded text-blue-600" />
              <span>IGD 24 Jam</span>
            </label>
          </div>

          <!-- Dropdown Jenis RS -->
          <div>
            <select
              (change)="updateTypeFilter($event)"
              class="w-full text-xs border-gray-300 rounded-md py-1.5 focus:border-blue-500 focus:ring-0"
            >
              <option value="all">Semua Jenis RS</option>
              <option value="RSU">RS Umum</option>
              <option value="RSKIA">Ibu & Anak</option>
              <option value="RS Khusus">Khusus (Mata/Jiwa/dll)</option>
            </select>
          </div>
          
          <button 
            (click)="fetchNearbyHospitals()" 
            class="w-full rounded bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm flex justify-center items-center gap-2"
            [disabled]="isLoading()"
          >
            @if(isLoading()) { <span class="animate-spin">↻</span> }
            Terapkan Filter
          </button>
        </div>

        <!-- List Hasil -->
        <div class="flex-1 space-y-3 overflow-y-auto pr-1">
          <div class="flex justify-between items-end mb-2">
            <h3 class="font-semibold text-gray-800 text-sm">Hasil Pencarian</h3>
            <span class="text-xs text-gray-500">{{ filteredHospitals().length }} RS ditemukan</span>
          </div>

          @for (hospital of filteredHospitals(); track hospital.id) {
            <div
              class="cursor-pointer rounded-lg border border-gray-100 bg-white p-3 shadow-sm transition-all hover:border-blue-400 hover:shadow-md group"
              (click)="onSelectHospital(hospital)"
            >
              <div class="flex justify-between items-start">
                <h4 class="font-bold text-gray-800 text-sm group-hover:text-blue-700 line-clamp-1">{{ hospital.name }}</h4>
                @if (hospital.dist_meters) {
                  <span class="text-[10px] font-mono font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 whitespace-nowrap">
                    {{ (hospital.dist_meters / 1000) | number:'1.1-1' }} km
                  </span>
                }
              </div>
              <p class="text-xs text-gray-500 mt-1 line-clamp-1">{{ hospital.address }}</p>

              <div class="mt-2 flex gap-1.5 flex-wrap">
                @if (hospital.bpjs) { <span class="badge bg-green-50 text-green-700 border border-green-100">BPJS</span> }
                @if (hospital.igd) { <span class="badge bg-red-50 text-red-700 border border-red-100">IGD 24 Jam</span> }
                @if (hospital.type && hospital.type !== 'RSU') { 
                  <span class="badge bg-purple-50 text-purple-700 border border-purple-100">{{ hospital.type }}</span> 
                }
              </div>
            </div>
          } @empty {
            <div class="text-center py-8 text-gray-400 text-sm">
              <p>Tidak ada RS yang sesuai filter.</p>
              <p class="text-xs mt-1">Coba perbesar radius pencarian.</p>
            </div>
          }
        </div>
      </aside>

      <!-- MAP CONTAINER -->
      <main class="relative h-full w-full z-10 bg-gray-100">
        <div id="map" class="h-full w-full" style="z-index: 1;"></div>
        
        <!-- Info Box Rute (Floating) -->
        @if (routeInfo()) {
          <div class="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-xl shadow-2xl max-w-xs border border-gray-100 animate-fade-in">
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-bold text-gray-800 text-sm">Rute Terpilih</h4>
              <button (click)="clearRoute()" class="text-gray-400 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
            <div class="flex items-center gap-4">
              <div>
                <p class="text-xs text-gray-500">Jarak</p>
                <p class="text-xl font-bold text-blue-600">{{ routeInfo()?.distance }}</p>
              </div>
              <div class="w-px h-8 bg-gray-200"></div>
              <div>
                <p class="text-xs text-gray-500">Waktu</p>
                <p class="text-xl font-bold text-purple-600">{{ routeInfo()?.time }}</p>
              </div>
            </div>
          </div>
        }

        <!-- Info Error Lokasi -->
        @if (locationError()) {
          <div class="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-red-100 px-6 py-2 text-xs font-semibold text-red-700 shadow-lg border border-red-200 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            {{ locationError() }}
          </div>
        }
      </main>
    </div>
  `,
  styles: `
    .badge { @apply px-2 py-0.5 rounded text-[10px] font-semibold; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    
    /* Styling Custom untuk Popup Leaflet agar seperti screenshot */
    ::ng-deep .custom-popup .leaflet-popup-content-wrapper {
      border-radius: 12px;
      padding: 0;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    ::ng-deep .custom-popup .leaflet-popup-content {
      margin: 16px;
      line-height: 1.5;
    }
    ::ng-deep .custom-popup .leaflet-popup-tip {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    ::ng-deep .custom-popup a.leaflet-popup-close-button {
      top: 12px;
      right: 12px;
      color: #9ca3af;
      font-size: 18px;
    }
    ::ng-deep .custom-pulse-icon .pulse-ring {
      border: 3px solid white;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit, OnDestroy {
  private supabase: SupabaseClient;
  private map: any;
  private userMarker: any;
  private radiusCircle: any;
  private markersLayer: any;
  private routingControl: any = null;

  private cdr = inject(ChangeDetectorRef);

  // --- STATE ---
  radiusKm = signal<number>(10); // Default 10km agar mencakup banyak RS
  userLocation = signal<{ lat: number; lng: number } | null>(null);
  hospitals = signal<Hospital[]>([]);
  searchTerm = signal<string>('');
  filters = signal({ bpjs: false, igd: false });
  selectedType = signal<string>('all');
  isLoading = signal<boolean>(false);
  
  locationError = signal<string | null>(null);
  routeInfo = signal<{ distance: string; time: string } | null>(null);

  // Computed Filter
  filteredHospitals = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const { bpjs, igd } = this.filters();
    const type = this.selectedType();

    return this.hospitals().filter(h => {
      const matchName = h.name.toLowerCase().includes(term);
      const matchBpjs = !bpjs || h.bpjs;
      const matchIgd = !igd || h.igd;
      const rsType = h.type || 'RSU';
      
      let matchType = false;
      if (type === 'all') matchType = true;
      else if (type === 'RS Khusus') matchType = rsType === 'RS Khusus' || rsType === 'RS Jiwa' || rsType === 'RS Mata';
      else matchType = rsType === type;

      return matchName && matchBpjs && matchIgd && matchType;
    });
  });

  // Computed: RS Terdekat (Selalu index ke-0 karena DB sudah sorting)
  nearestHospital = computed(() => {
    const list = this.filteredHospitals();
    return list.length > 0 ? list[0] : null;
  });

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  ngOnInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  private async initMap() {
    while (!(window as any).L) await new Promise(r => setTimeout(r, 100));
    
    this.map = L.map('map').setView([-7.795, 110.369], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);

    this.map.locate({ setView: true, maxZoom: 14, watch: true });
    
    this.map.on('locationfound', (e: any) => {
      const latlng = e.latlng;
      this.userLocation.set(latlng);
      this.locationError.set(null);
      
      if (!this.userMarker) {
        this.userMarker = L.marker(latlng, {
          icon: L.divIcon({
            className: 'custom-pulse-icon',
            html: `<div class="pulse-ring w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>`,
            iconSize: [16, 16]
          })
        }).addTo(this.map).bindPopup("<b>Lokasi Anda</b>");
        
        this.fetchNearbyHospitals();
      } else {
        this.userMarker.setLatLng(latlng);
      }
    });

    this.map.on('locationerror', (e: any) => {
      this.locationError.set("Gagal mengambil lokasi GPS. Pastikan izin lokasi aktif.");
      this.cdr.detectChanges();
    });
  }

  async fetchNearbyHospitals() {
    const userLoc = this.userLocation();
    if (!userLoc) return;

    this.isLoading.set(true);
    
    if (this.radiusCircle) this.map.removeLayer(this.radiusCircle);

    this.radiusCircle = L.circle(userLoc, {
      color: '#3b82f6',
      fillColor: '#60a5fa',
      fillOpacity: 0.1,
      weight: 1,
      radius: this.radiusKm() * 1000
    }).addTo(this.map);
    
    this.map.fitBounds(this.radiusCircle.getBounds());

    try {
      const { data, error } = await this.supabase.rpc('nearby_hospitals', {
        lat: userLoc.lat,
        long: userLoc.lng,
        radius_meters: this.radiusKm() * 1000
      });

      if (error) throw error;

      const mappedData: Hospital[] = (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        address: row.address,
        location: [row.lat, row.long],
        phone: row.phone,
        website: row.website,
        bpjs: row.bpjs,
        igd: row.igd,
        type: row.type, 
        dist_meters: row.dist_meters
      }));

      this.hospitals.set(mappedData);
      this.updateMarkers();
      
    } catch (err) {
      console.error('Error fetch spatial data:', err);
    } finally {
      this.isLoading.set(false);
      this.cdr.detectChanges();
    }
  }

  private updateMarkers() {
    this.markersLayer.clearLayers();
    
    const icon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });

    this.filteredHospitals().forEach(h => {
      L.marker(h.location, { icon })
        .addTo(this.markersLayer)
        .on('click', () => {
          this.showRoute(h);
        });
    });
  }

  onSelectHospital(h: Hospital) {
    this.map.flyTo(h.location, 16);
    this.showRoute(h);
  }

  showRoute(hospital: Hospital): void {
    const userLoc = this.userLocation();

    if (!userLoc) {
      this.locationError.set('Menunggu lokasi GPS...');
      this.cdr.detectChanges();
      return;
    }

    this.clearRoute();

    const from = L.latLng(userLoc.lat, userLoc.lng);
    const to = L.latLng(hospital.location[0], hospital.location[1]);

    const routing = (L as any).Routing.control({
      waypoints: [from, to],
      routeWhileDragging: false,
      show: false,
      showAlternatives: true,
      lineOptions: {
        styles: [{ color: '#2563eb', opacity: 0.8, weight: 6 }],
      },
      altLineOptions: {
        styles: [{ color: '#94a3b8', opacity: 0.7, weight: 4, dashArray: '5, 10' }],
      },
      createMarker: () => null,
    }).addTo(this.map);

    routing.on('routesfound', (e: any) => {
      const route = e.routes?.[0];
      if (!route?.summary) return;

      const distanceKm = (route.summary.totalDistance / 1000).toFixed(1);
      const durationText = this.formatDuration(route.summary.totalTime);

      // --- POPUP STYLE SESUAI SCREENSHOT ---
      const popupHtml = `
        <div class="font-sans min-w-[280px]">
          <h3 class="font-bold text-lg text-gray-900 mb-1 leading-snug">${hospital.name}</h3>
          <p class="text-xs text-gray-500 mb-3 leading-relaxed border-b border-gray-100 pb-2">
            ${hospital.address}
          </p>

          <div class="space-y-2 mb-4">
            <div class="flex items-start gap-2 text-sm text-gray-700">
              <div class="text-pink-500 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg></div>
              <div><span class="font-semibold text-gray-900">Telepon:</span> ${hospital.phone || '-'}</div>
            </div>

            <div class="flex items-start gap-2 text-sm text-gray-700">
              <div class="text-blue-500 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd" /></svg></div>
              <div><span class="font-semibold text-gray-900">Website:</span> 
                ${hospital.website && hospital.website !== '-' ? 
                  `<a href="${hospital.website}" target="_blank" class="text-blue-600 hover:underline">Kunjungi Web</a>` : 
                  '-'}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4 text-sm font-medium text-gray-800 bg-gray-50 p-2 rounded-lg">
            <div class="flex items-center gap-1.5">
              <span class="text-red-500">🚗</span>
              <span>Jarak: <b>${distanceKm} km</b></span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-purple-600">⏱️</span>
              <span>Waktu: <b>${durationText}</b></span>
            </div>
          </div>
        </div>
      `;

      L.popup({ offset: [0, -30], className: 'custom-popup' })
        .setLatLng(to)
        .setContent(popupHtml)
        .openOn(this.map);

      this.routeInfo.set({
        distance: `${distanceKm} km`,
        time: durationText
      });
      this.cdr.detectChanges();
    });

    this.routingControl = routing; 
    this.cdr.detectChanges();
  }

  clearRoute() {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
      this.routingControl = null;
      this.routeInfo.set(null);
    }
  }

  private formatDuration(totalSeconds: number): string {
    const totalMinutes = Math.round(totalSeconds / 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h > 0) return `${h} jam ${m} menit`;
    return `${m} menit`;
  }

  updateSearch(e: any) { this.searchTerm.set(e.target.value); }
  updateFilter(key: 'bpjs' | 'igd', target: any) { 
    this.filters.update(f => ({ ...f, [key]: target.checked })); 
  }
  updateTypeFilter(e: any) { this.selectedType.set(e.target.value); }
  onRadiusChange(val: any) { this.radiusKm.set(val); }
}