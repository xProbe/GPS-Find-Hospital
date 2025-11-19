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

declare const L: any;

interface Hospital {
  id: number;
  name: string;
  address: string;
  location: [number, number]; 
  bpjs: boolean;
  igd: boolean;
}

const HOSPITAL_DATA: Hospital[] = [
  {
    id: 1,
    name: 'RS Panti Rapih',
    address: 'Jl. Cik Di Tiro No.30, Terban, Yogyakarta',
    location: [-7.777077521342981, 110.37655841148005],
    bpjs: true,
    igd: true,
  },
  {
    id: 2,
    name: 'RSUP Dr. Sardjito',
    address: 'Jl. Kesehatan No.1, Sendowo, Yogyakarta',
    location: [-7.768517659344025, 110.37396912130437],
    bpjs: true,
    igd: true,
  },
  {
    id: 3,
    name: 'RS Bethesda Yogyakarta',
    address: 'Jl. Jend. Sudirman No.70, Kotabaru, Yogyakarta',
    location: [-7.783248057380597, 110.37822125628553],
    bpjs: true,
    igd: false,
  },
  {
    id: 4,
    name: 'RS Jogja International Hospital (JIH)',
    address: 'Jl. Ring Road Utara No.160, Condongcatur',
    location: [-7.7575414383404055, 110.40357860131424],
    bpjs: false,
    igd: true,
  },
  {
    id: 5,
    name: 'RS Siloam Yogyakarta',
    address: 'Jl. Laksda Adisucipto No.32-34, Demangan',
    location: [-7.783274265409471, 110.39154899524551],
    bpjs: true,
    igd: true,
  },
  {
    id: 6,
    name: 'RS PKU Muhammadiyah Yogyakarta',
    address:
      'Jl. H. Agus Salim No.17, Ngampilan, Kec. Ngampilan, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55261',
    location: [-7.8010943381299445, 110.36224708801456],
    bpjs: false,
    igd: true,
  },
  {
    id: 7,
    name: 'RS Hermina Yogyakarta',
    address:
      'Jl. Selokan Mataram No.5, Puren, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281',
    location: [-7.770116382956189, 110.43275317408742],
    bpjs: true,
    igd: true,
  },
  {
    id: 8,
    name: 'RSUD Kota Yogyakarta',
    address:
      'Jl. Wirosaban No.1, Sorosutan, Kec. Umbulharjo, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55162',
    location: [-7.824949376873489, 110.37786472886548],
    bpjs: true,
    igd: true,
  },
  {
    id: 9,
    name: 'RSUD Sleman',
    address:
      'Jl. Bhayangkara No.17, Triharjo, Kec. Sleman, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55514',
    location: [-7.686708573496059, 110.34190862606522],
    bpjs: true,
    igd: true,
  },
  {
    id: 10,
    name: 'RSKIA Sadewa',
    address:
      'Jalan Babarsari Blok TB 16 No.13B, Tambak Bayan, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281',
    location: [-7.77093442477144, 110.41591319159328],
    bpjs: false,
    igd: true,
  },

];

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [CommonModule], 

  template: `
    <div class="font-inter grid h-screen w-full grid-cols-1 md:grid-cols-[380px_1fr]">
      <aside class="flex h-full flex-col bg-gray-50 p-4 shadow-lg md:overflow-y-auto">
        <h1 class="mb-4 text-2xl font-bold text-blue-700">Pencari RS Terdekat</h1>
        <p class="mb-4 text-sm text-gray-600">Aplikasi LBS untuk menemukan rumah sakit terdekat.</p>

        <div class="relative mb-4">
          <input
            type="text"
            placeholder="Cari nama rumah sakit..."
            (input)="updateSearch($event)"
            class="w-full rounded-lg border border-gray-300 p-2 pl-8 pr-4 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <svg
            class="absolute left-2 top-2.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <div class="mb-4 space-y-2 rounded-lg bg-white p-3 shadow-sm">
          <h3 class="font-semibold text-gray-800">Filter Pencarian</h3>
          <div class="flex items-center justify-between">
            <label for="bpjs" class="flex items-center space-x-2 text-gray-700">
              <svg
                class="h-5 w-5 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Menerima BPJS</span>
            </label>
            <input
              id="bpjs"
              type="checkbox"
              (change)="updateFilter('bpjs', $event.target.checked)"
              class="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div class="flex items-center justify-between">
            <label for="igd" class="flex items-center space-x-2 text-gray-700">
              <svg
                class="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
                />
              </svg>
              <span>IGD 24 Jam</span>
            </label>
            <input
              id="igd"
              type="checkbox"
              (change)="updateFilter('igd', $event.target.checked)"
              class="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="flex-1 space-y-3 overflow-y-auto pr-2">
          <h3 class="font-semibold text-gray-800">Hasil: ({{ filteredHospitals().length }})</h3>

          @if (filteredHospitals().length > 0) { @for (hospital of filteredHospitals(); track
          hospital.id) {
          <div
            class="cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
            (click)="panToHospital(hospital)"
          >
            <h4 class="font-bold text-blue-800">{{ hospital.name }}</h4>
            <p class="text-sm text-gray-600">{{ hospital.address }}</p>
            <div class="mt-2 flex items-center space-x-4">
              @if (hospital.bpjs) {
              <span class="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                >BPJS</span
              >
              } @if (hospital.igd) {
              <span class="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700"
                >IGD 24 Jam</span
              >
              }
            </div>
            <button
              (click)="showRoute(hospital); $event.stopPropagation()"
              class="mt-3 w-full rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Tampilkan Rute
            </button>
          </div>
          } } @else {
          <p class="p-4 text-center text-gray-500">
            Tidak ada rumah sakit yang sesuai dengan filter pencarian Anda.
          </p>
          }
        </div>
      </aside>

      <main class="relative h-full w-full">
        <div id="map" class="h-full w-full"></div>

        @if (routingControl()) {
        <button
          (click)="clearRoute()"
          class="absolute right-4 top-4 z-[1000] rounded-lg bg-white px-4 py-2 font-semibold text-red-600 shadow-lg transition-transform hover:scale-105"
        >
          Hapus Rute
        </button>
        }

        @if (isLoadingLocation()) {
        <div
          class="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-lg bg-white px-4 py-2 font-semibold text-gray-700 shadow-lg"
        >
          Mencari lokasi Anda...
        </div>
        }

        @if (locationError()) {
        <div
          class="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-lg bg-red-100 px-4 py-2 font-semibold text-red-700 shadow-lg"
        >
          {{ locationError() }}
        </div>
        }
      </main>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: 'Inter', sans-serif; 
    }
    
    aside div[class*="overflow-y-auto"]::-webkit-scrollbar {
      width: 6px;
    }
    aside div[class*="overflow-y-auto"]::-webkit-scrollbar-thumb {
      background-color: #cbd5e1; 
      border-radius: 3px;
    }
    aside div[class*="overflow-y-auto"]::-webkit-scrollbar-track {
      background-color: #f1f5f9; 
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit, OnDestroy {

  private map: any;
  private userMarker: any;
  private hospitalMarkerLayer = signal<any>(null); 

  private cdr = inject(ChangeDetectorRef); 
  isLoadingLocation = signal<boolean>(true); 
  userLocation = signal<any | null>(null); 
  routingControl = signal<any | null>(null); 
  locationError = signal<string | null>(null); 

  private allHospitals = signal<Hospital[]>(HOSPITAL_DATA); // Data RS
  searchTerm = signal<string>(''); 
  filters = signal<{ bpjs: boolean; igd: boolean }>({ bpjs: false, igd: false }); 


  filteredHospitals = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const { bpjs, igd } = this.filters();

    return this.allHospitals().filter((hospital: Hospital) => {
      const nameMatch = hospital.name.toLowerCase().includes(term);
      const bpjsMatch = !bpjs || (bpjs && hospital.bpjs);
      const igdMatch = !igd || (igd && hospital.igd);

      return nameMatch && bpjsMatch && igdMatch;
    });
  });


  constructor() {
    effect(() => {
      this.plotHospitals(this.filteredHospitals());
    });
  }

  ngOnInit(): void {
    this.waitForLeaflet().then(() => {
      this.initMap();
      this.initUserLocation(); 
      this.hospitalMarkerLayer.set(L.layerGroup().addTo(this.map));
      this.plotHospitals(this.filteredHospitals()); 
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }


  private async waitForLeaflet() {
    while (
      typeof L === 'undefined' ||
      typeof L.Icon === 'undefined' ||
      typeof L.Icon.Default === 'undefined'
    ) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }

  private initMap(): void {
    this.map = L.map('map').setView([-7.7951, 110.3695], 13); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);
  }

  private initUserLocation(): void {
    this.map
      .on('locationfound', (e: any) => {
        this.userLocation.set(e.latlng);
        this.isLoadingLocation.set(false);
        this.locationError.set(null); 
        this.cdr.detectChanges(); 

        if (this.userMarker) {
          this.userMarker.setLatLng(e.latlng);
        } else {
          this.userMarker = L.marker(e.latlng, {
            icon: this.createPulseIcon(), 
          })
            .addTo(this.map)
            .bindPopup('<b>Lokasi Anda Saat Ini</b>')
            .openPopup();
        }
        this.map.setView(e.latlng, 15); 
      })
      .on('locationerror', (e: any) => {
        console.error('Location error:', e.message);
        this.isLoadingLocation.set(false);
        this.locationError.set('Gagal mendapatkan lokasi. Pastikan izin lokasi/GPS aktif.');
        this.cdr.detectChanges();
      });

    this.map.locate({ setView: true, maxZoom: 16, watch: true });
  }


  private plotHospitals(hospitals: Hospital[]): void {
    const layer = this.hospitalMarkerLayer();
    if (!layer) return; 

    layer.clearLayers(); 

    const hospitalIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      shadowSize: [41, 41],
    });

    hospitals.forEach((hospital) => {
      L.marker(hospital.location, { icon: hospitalIcon })
        .addTo(layer)
        .bindPopup(`<b>${hospital.name}</b><br>${hospital.address}`)
        .on('click', () => {
          this.showRoute(hospital);
        });
    });
  }

  showRoute(hospital: Hospital): void {
    const userLoc = this.userLocation();
    if (!userLoc) {
      this.locationError.set('Lokasi Anda belum ditemukan. Mohon tunggu...');
      this.cdr.detectChanges();
      return;
    }

    this.clearRoute(); 

    const newRoutingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(userLoc.lat, userLoc.lng), 
        L.latLng(hospital.location[0], hospital.location[1]), 
      ],
      routeWhileDragging: true,
      show: false, 
      lineOptions: {
        styles: [{ color: '#007BFF', opacity: 0.8, weight: 6 }], 
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      createMarker: () => null, 
    }).addTo(this.map);

    this.routingControl.set(newRoutingControl); 
    this.cdr.detectChanges(); 
  }

  clearRoute(): void {
    const currentRoute = this.routingControl();
    if (currentRoute) {
      this.map.removeControl(currentRoute);
      this.routingControl.set(null);
      this.cdr.detectChanges();
    }
  }

  panToHospital(hospital: Hospital): void {
    this.map.flyTo(hospital.location, 16); 
    this.hospitalMarkerLayer()
      .getLayers()
      .find(
        (layer: any) =>
          layer.getLatLng().lat === hospital.location[0] &&
          layer.getLatLng().lng === hospital.location[1]
      )
      .openPopup();
  }


  updateSearch(event: any): void {
    this.searchTerm.set(event.target.value);
  }

  updateFilter(filter: 'bpjs' | 'igd', value: boolean): void {
    this.filters.update((currentFilters: { bpjs: boolean; igd: boolean }) => ({
      ...currentFilters,
      [filter]: value,
    }));
  }


  private createPulseIcon() {
    return L.divIcon({
      className: 'custom-pulse-icon',
      html: `
        <style>
          .custom-pulse-icon {
            width: 20px;
            height: 20px;
          }
          .pulse-ring {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #007BFF;
            border: 2px solid #fff;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
            animation: pulse-animation 1.5s infinite;
          }
          /* Animasi denyut */
          @keyframes pulse-animation {
            0% {
              transform: scale(0.8);
              box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
            }
            70% {
              transform: scale(1.2);
              box-shadow: 0 0 0 15px rgba(0, 123, 255, 0);
            }
            100% {
              transform: scale(0.8);
              box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
            }
          }
        </style>
        <div class="pulse-ring"></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  }
}
