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
  phone?: string;
  website?: string;
  fasilitas?: string[];
  bpjs: boolean;
  igd: boolean;
}


const HOSPITAL_DATA: Hospital[] = [
  {
    "id": 1,
    "name": "RS Elisabeth",
    "address": "Ganjuran Sumbermulyo Bambanglipuro, Jl. Kaligondang, Kaligondang, Sumbermulyo, Kec. Bantul, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55764",
    "location": [
      -7.9256637,
      110.3186623
    ],
    "phone" : "(0274) 367502",
    "website" : "http://rselisabeth.or.id",
    "bpjs": false,
    "igd": true
  },
  {
    "id": 2,
    "name": "Rumah Sakit Gigi Dan Mulut Dr.Soedomo",
    "address": "Jl. Denta Sekip Utara No.1, Sendowo, Sinduadi, Kec. Mlati, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281",
    "location": [
      -7.7705587,
      110.373988
    ],
    "phone" : "(0274) 555312",
    "website" : "-",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 3,
    "name": "Rumah Sakit Khusus Puri Nirmala",
    "address": "Jl. Jayaningprangan No.13, Gunungketur, Pakualaman, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55166",
    "location": [
      -7.8008879,
      110.3769107
    ],
    "phone" : "(0274) 515255",
    "website" : "http://www.purinirmala.com",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 4,
    "name": "Rumah Sakit Umum Daerah (RSUD) Kota Yogyakarta",
    "address": "Jl. Ki Ageng Pemanahan No.1-6, Sorosutan, Kec. Umbulharjo, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55162",
    "location": [
      -7.8258561,
      110.3782841
    ],
    "phone" : "(0274) 371195",
    "website" : "http://rumahsakitjogja.jogjakota.go.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 5,
    "name": "RS PKU Muhammadiyah Yogyakarta",
    "address": "Jl. KH. Ahmad Dahlan No.20, Ngupasan, Kec. Gondomanan, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55122",
    "location": [
      -7.8007195,
      110.3624308
    ],
    "phone" : "(0274) 512653",
    "website" : "https://rspkujogja.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 6,
    "name": "RS Panti Rini",
    "address": "Jl. Raya Solo - Yogyakarta KM.13,2, Kringinan, Tirtomartani, Kec. Kalasan, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55571",
    "location": [
      -7.7716651,
      110.4665395
    ],
    "phone" : "(0274) 496022",
    "website" : "http://pantirini.or.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 7,
    "name": "Rumah Sakit Akademik UGM",
    "address": "Jl. Kabupaten, Kranggahan I, Trihanggo, Kec. Gamping, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55291",
    "location": [
      -7.7431999,
      110.3504099
    ],
    "phone" : "08112856210",
    "website" : "http://rsa.ugm.ac.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 8,
    "name": "Rumah Sakit Bethesda Lempuyangwangi",
    "address": "Jl. Hayam Wuruk No.6, Bausasran, Kec. Danurejan, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55211",
    "location": [
      -7.796421,
      110.3730409
    ],
    "phone" : "(0274) 512257",
    "website" : "http://www.rsbl.or.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 9,
    "name": "Rumah Sakit Panti Rapih",
    "address": "Jl. Cik Di Tiro No.30, Samirono, Terban, Kec. Gondokusuman, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55223",
    "location": [
      -7.777175,
      110.3776312
    ],
    "phone" : "(0274) 563333",
    "website" : "http://www.pantirapih.or.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 11,
    "name": "Rumah Sakit PKU Muhammadiyah Gamping",
    "address": "Jl. Wates, Jl. Nasional III KM.5,5, Bodeh, Ambarketawang, Kec. Gamping, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55294",
    "location": [
      -7.8005273,
      110.3174774
    ],
    "phone" : "(0274) 6499704",
    "website" : "https://pkugamping.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 12,
    "name": "Rumah Sakit Hermina",
    "address": "Jl. Selokan Mataram, RT.06/RW.50, Meguwo, Maguwoharjo, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55282",
    "location": [
      -7.7700612,
      110.4325755
    ],
    "phone" : "(0274) 2800808",
    "website" : "http://www.herminahospitals.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 13,
    "name": "RS PKU muhammadiyah Sleman",
    "address": "Jl. Magelang No.Km.10, RW.5, Sawahan, Pandowoharjo, Kec. Sleman, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55512",
    "location": [
      -7.7094678,
      110.3579754
    ],
    "phone" : "(0274) 7778610",
    "website" : "https://pkusleman.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 14,
    "name": "RSU PKU Muhammadiyah Bantul",
    "address": "Jl. Jend. Sudirman No.124, Nyangkringan, Bantul, Kec. Bantul, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55711",
    "location": [
      -7.8869242,
      110.3303439
    ],
    "phone" : "(0274) 367437",
    "website" : "-",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 15,
    "name": "RS Khusus Ibu dan Anak Adinda",
    "address": "Jalan Soragan No.14, Soragan, Ngestiharjo, Kasihan, Bantul, Daerah Istimewa Yogyakarta 55184",
    "location": [
      -7.7854417,
      110.3486988
    ],
    "phone" : "(0274) 622988",
    "website" : "-",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 16,
    "name": "Rumah Sakit Bethesda",
    "address": "Jl. Jend. Sudirman No.70, Kotabaru, Kec. Gondokusuman, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55224",
    "location": [
      -7.7839589,
      110.3774054
    ],
    "phone" : "(0274) 586688",
    "website" : "http://bethesda.or.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 17,
    "name": "Rumah Sakit Pratama",
    "address": "Karanganyar, Jl. Kolonel Sugiyono No.98, Brontokusuman, Kec. Mergangsan, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55153",
    "location": [
      -7.8158504,
      110.3737144
    ],
    "phone" : "(0274) 373249",
    "website" : "https://rspratama.jogjakota.go.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 18,
    "name": "RS Khusus Ibu dan Anak Kahyangan",
    "address": "Jalan Tino Sidin No.390, Kadipiro, Baru, Kdipiro, Ngestiharjo, Kasihan, Bantul, Daerah Istimewa Yogyakarta 55184",
    "location": [
      -7.7982805,
      110.3449631
    ],
    "phone" : "(0274) 618953",
    "website" : "https://rskia-kahyangan.com",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 19,
    "name": "RS Terpadu Penyandang Disabilitas",
    "address": "JL Parangtritis, Km. 5, Sewon, Gabusan, Timbulharjo, Kec. Bantul, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55185",
    "location": [
      -7.9584149,
      110.3445442
    ],
    "phone" : "(0274) 6464177",
    "website" : "-",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 20,
    "name": "Rumah Sakit Khusus Paru Respira",
    "address": "Jl. Panembahan Senopati No.4, Dagaran, Palbapang, Kec. Bantul, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55713",
    "location": [
      -7.9056471,
      110.3202573
    ],
    "phone" : "08970377779",
    "website" : "http://rsprespira.jogjaprov.go.id",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 37,
    "name": "RS BHAYANGKARA POLDA DIY",
    "address": "Jl. Raya Solo - Yogyakarta KM.14, Glondong, Tirtomartani, Kec. Kalasan, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55571",
    "location": [
      -7.7662052,
      110.471613
    ],
    "phone" : "(0274) 498278",
    "website" : "http://rsbhayangkarajogja.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 39,
    "name": "RSKIA Permata Bunda",
    "address": "Jl. Ngeksigondo No.56, Prenggan, Kec. Kotagede, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55172",
    "location": [
      -7.8206723,
      110.3997245
    ],
    "phone" : "(0274) 376092",
    "website" : "-",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 40,
    "name": "RSKIA PKU Muhammadiyah Kotagede",
    "address": "Jl. Kemasan No.30, Purbayan, Kotagede, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55173",
    "location": [
      -7.8229229,
      110.4007525
    ],
    "phone" : "(0274) 371201",
    "website" : "https://pkukotagede.co.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 42,
    "name": "RSUD Wonosari",
    "address": "Jl. Taman Bakti No.6, Purbosari, Wonosari, Kec. Wonosari, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta 55813",
    "location": [
      -7.9619151,
      110.6039156
    ],
    "phone" : "(0274) 391288",
    "website" : "-",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 43,
    "name": "RSKIA Sadewa",
    "address": "Jalan Babarsari Blok TB 16 No.13B, Tambak Bayan, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281",
    "location": [
      -7.7711113,
      110.4158089
    ],
    "phone" : "(0274) 489118",
    "website" : "http://rskiasadewa.co.id",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 44,
    "name": "RSU Gramedika",
    "address": "Jl. Besi Jangkang No.20, Candi Karang, Sardonoharjo, Kec. Ngaglik, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55581",
    "location": [
      -7.7014093,
      110.4169859
    ],
    "phone" : "(0274) 898501",
    "website" : "-",
    "bpjs": false,
    "igd": true
  },
  {
    "id": 46,
    "name": "RSUD PRAMBANAN",
    "address": "Jl. Raya Piyungan - Prambanan No.KM. 7, Delegan, Sumberharjo, Kec. Prambanan, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55572",
    "location": [
      -7.8047113,
      110.4832671
    ],
    "phone" : "(0274) 4398357",
    "website" : "https://rsudprambanan.slemankab.go.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 47,
    "name": "Rumah Sakit Khusus Bedah (RSKB) Ring Road Selatan Bantul",
    "address": "Glugo, Panggungharjo, Kec. Sewon, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55188",
    "location": [
      -7.8341552,
      110.3604094
    ],
    "phone" : "(0274) 376115",
    "website" : "http://rsbedahringroadselatan.co.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 50,
    "name": "RSUD Sleman",
    "address": "Jl. Bhayangkara No.48, Temulawak, Triharjo, Kec. Sleman, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55514",
    "location": [
      -7.6875491,
      110.3423403
    ],
    "phone" : "(0274) 868437",
    "website" : "https://rsudsleman.slemankab.go.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 51,
    "name": "RSKB SINDUADI",
    "address": "Jalan Wijaya Kusuma, Jl. Patran Gg. Trini Tegal No.310, Sinduadi, Kec. Mlati, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55284",
    "location": [
      -7.7573539,
      110.3633696
    ],
    "phone" : "088216412177",
    "website" : "https://rskbsinduadi.co.id",
    "bpjs": false,
    "igd": true
  },
  {
    "id": 52,
    "name": "Rumah Sakit Dr Soetarto",
    "address": "Jl. Juadi No.19, Kotabaru, Kec. Gondokusuman, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55224",
    "location": [
      -7.7856307,
      110.3769937
    ],
    "phone" : "(0274) 2920000",
    "website" : "-",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 53,
    "name": "Rumah Sakit JIH",
    "address": "Jl. Ring Road Utara No.160, Perumnas Condong Catur, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55283",
    "location": [
      -7.7578076,
      110.4034681
    ],
    "phone" : "(0274) 4463535",
    "website" : "http://www.rs-jih.co.id",
    "bpjs": true,
    "igd": false
  },
  {
    "id": 54,
    "name": "Rumah Sakit Ludira Husada Tama",
    "address": "Jl. Wiratama No.4, Tegalrejo, Kec. Tegalrejo, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55244",
    "location": [
      -7.7923811,
      110.352903
    ],
    "phone" : "(0274) 620333",
    "website" : "http://www.rsludirahusadatama.co.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 55,
    "name": "Rumah Sakit Khusus Bedah Soedirman",
    "address": "Jl. Sidobali Muja Muju UH II/402 Telp. (0274) -589090 Yogyakarta 55165",
    "location": [
      -7.8006439,
      110.3975316
    ],
    "phone" : "-",
    "website" : "-",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 56,
    "name": "Rumah Sakit Bhakti Ibu",
    "address": "Jl. Golo No.33, Pandeyan, Kec. Umbulharjo, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55162",
    "location": [
      -7.81485,
      110.3816394
    ],
    "phone" : "(0274) 376793",
    "website" : "https://klinikbhaktiibu.com",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 57,
    "name": "Rumah Sakit Khusus Bedah An-Nur",
    "address": "Jl. Colombo No.14 - 16, Samirono, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281",
    "location": [
      -7.778097,
      110.386838
    ],
    "phone" : "(0274) 585848",
    "website" : "https://annurhospital.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 62,
    "name": "Rumah Sakit Ibu dan Anak Fajar",
    "address": "Jl. Bugisan No.6-8, Patangpuluhan, Wirobrajan, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55251",
    "location": [
      -7.8085976,
      110.3499098
    ],
    "phone" : "082332510100",
    "website" : "-",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 63,
    "name": "RSKIA Rachmi",
    "address": "Jl. KH. Wachid Hasyim D.I No.47, Notoprajan, Ngampilan, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55262",
    "location": [
      -7.8036201,
      110.3565178
    ],
    "phone" : "(0274) 376717",
    "website" : "http://www.rskiarachmi.com",
    "bpjs": false,
    "igd": true
  },
  {
    "id": 64,
    "name": "Rumah Sakit Universitas Ahmad Dahlan",
    "address": "Karangsari, Wedomartani, Ngemplak, Sleman",
    "location": [
      -7.7471255,
      110.4248621
    ],
    "phone" : "(0274) 4477068",
    "website" : "http://rsuad.co.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 65,
    "name": "Rumah Sakit Nur Hidayah",
    "address": "Jl. Imogiri Tim. No.KM.11, Bembem, Trimulyo, Kec. Jetis, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55781",
    "location": [
      -7.8862197,
      110.3879854
    ],
    "phone" : "081220688090",
    "website" : "https://rsnurhidayah.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 66,
    "name": "RS Happy Land",
    "address": "Jl. Ipda Tut Harsono Jl. Melati Wetan No.53, Muja Muju, Kec. Umbulharjo, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55165",
    "location": [
      -7.7939635,
      110.3921868
    ],
    "phone" : "(0274) 550060",
    "website" : "https://rshappyland.com",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 67,
    "name": "RSI Hidayatullah",
    "address": "Jl. Veteran No.184, Pandeyan, Kec. Umbulharjo, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55161",
    "location": [
      -7.8150629,
      110.3877007
    ],
    "phone" : "(0274) 389194",
    "website" : "-",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 68,
    "name": "RSUD Panembahan Senopati",
    "address": "Jalan Dr. Wahidin Sudiro Husodo, Area Sawah, Trirenggo, Kec. Bantul, Bantul, Daerah Istimewa Yogyakarta 55714",
    "location": [
      -7.8924266,
      110.3379658
    ],
    "phone" : "(0274) 367381",
    "website" : "http://rsudps.bantulkab.go.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 70,
    "name": "RSUP Dr. Sardjito",
    "address": "Jalan Kesehatan No. 1, Sinduadi, Mlati, Senolowo, Sinduadi, Mlati, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281",
    "location": [
      -7.7681923,
      110.3728728
    ],
    "phone" : "(0274) 587333",
    "website" : "http://sardjito.co.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 71,
    "name": "Rumah Sakit Umum Rachma Husada",
    "address": "Jalan Parangtritis Km. 16, Patalan Jetis Bantul Yogyakarta",
    "location": [
      -7.9321319,
      110.3459035
    ],
    "phone" : "(0274) 6460091",
    "website" : "https://rsurachmahusada.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 72,
    "name": "Rumah Sakit Umum Queen Latifa",
    "address": "Jalan Ringroad Barat No.118, Mlangi, Nogotirto, Gamping, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55294",
    "location": [
      -7.7626259,
      110.3370301
    ],
    "phone" : "(0274) 581402",
    "website" : "https://rsu.queenlatifa.co.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 73,
    "name": "RS Sakina Idaman",
    "address": "Jalan Monjali No.106, Kutu Dukuh, Sinduadi, Mlati, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55284",
    "location": [
      -7.7675837,
      110.3678423
    ],
    "phone" : "(0274) 5018221",
    "website" : "http://sakinaidaman.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 74,
    "name": "Rumah Sakit Rajawali Citra",
    "address": "Jl. Pleret No.KM 2.5, Banjardadap, Potorono, Kec. Banguntapan, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55196",
    "location": [
      -7.848608,
      110.410236
    ],
    "phone" : "082134313535",
    "website" : "https://rsrcjogja.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 75,
    "name": "Rumah Sakit Medika Respati",
    "address": "Jl. Raya Tajem, Tajem, Maguwoharjo, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281",
    "location": [
      -7.7483432,
      110.4337728
    ],
    "phone" : "-",
    "website" : "-",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 76,
    "name": "RS Puri Husada",
    "address": "Jl. Palagan Tentara Pelajar Jl. Rejodani No.67 Km.11, Ngetiran, Sariharjo, Ngaglik, Sleman Regency, Special Region of Yogyakarta 55581",
    "location": [
      -7.7058103,
      110.3864518
    ],
    "phone" : "(0274) 867270",
    "website" : "http://purihusada.co.id",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 77,
    "name": "RSU PANTI BAKTININGSIH",
    "address": "Sendangmulyo, Kabupaten Sleman, Daerah Istimewa Yogyakarta",
    "location": [
      -7.7550695,
      110.2423762
    ],
    "phone" : "(0274) 6497209",
    "website" : "-",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 78,
    "name": "Rumah Sakit Jiwa Grhasia",
    "address": "Duwetsari, Pakembinangun, Kec. Pakem, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55582",
    "location": [
      -7.6619073,
      110.4218117
    ],
    "phone" : "(0274) 895143",
    "website" : "http://grhasia.jogjaprov.go.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 79,
    "name": "RS Panti Nugroho",
    "address": "Jl. Kaliurang No.KM.17, Sukanan, Pakembinangun, Kec. Pakem, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55584",
    "location": [
      -7.6687433,
      110.417139
    ],
    "phone" : "(0274) 895186",
    "website" : "http://pantinugroho.or.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 80,
    "name": "Rumah Sakit At-Turots Al-Islamy",
    "address": "Klaci I, Margoluwih, Seyegan, Sleman",
    "location": [
      -7.7504498,
      110.2939203
    ],
    "phone" : "(0274) 6496677",
    "website" : "http://rsatturots.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 81,
    "name": "Rumah Sakit Universitas Islam Indonesia",
    "address": "Jl. Srandakan No.KM, RW.5, Jodog, Wijirejo, Kec. Pandak, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55761",
    "location": [
      -7.909138,
      110.2960523
    ],
    "phone" : "(0274) 2812999",
    "website" : "http://rsuii.co.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 82,
    "name": "RS Mata Dr. Yap",
    "address": "Jl. Cik Di Tiro No.5, Terban, Kec. Gondokusuman, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55223",
    "location": [
      -7.7805775,
      110.3744425
    ],
    "phone" : "(0274) 562054",
    "website" : "http://www.yap.or.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 83,
    "name": "RSPAU dr. S. Hardjolukito",
    "address": "Jalan Janti Yogyakarta, Lanud Adisutjipto, Jl. Ringroad Timur, Karang Janbe, Banguntapan, Kec. Banguntapan, Bantul, Daerah Istimewa Yogyakarta 55198",
    "location": [
      -7.7975098,
      110.4115735
    ],
    "phone" : "(0274) 444715",
    "website" : "http://www.rspauhardjolukito.co.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 84,
    "name": "Rumah Sakit Umum Daerah (RSUD) Wates",
    "address": "Jalan Tentara Pelajar, Wates, Kulon Progo, Daerah Istimewa Yogyakarta",
    "location": [
      -7.8603316,
      110.1467142
    ],
    "phone" : "(0274) 773169",
    "website" : "http://rsud.kulonprogokab.go.id",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 86,
    "name": "RS Islam Yogyakarta PDHI",
    "address": "Temanggal II, Purwomartani, Kec. Kalasan, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55571",
    "location": [
      -7.7757097,
      110.4584845
    ],
    "phone" : "(0274) 498000",
    "website" : "http://www.rsiypdhi.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 88,
    "name": "Rumah Sakit Condong Catur",
    "address": "Jl. Manggis No.6, Gempol, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55581",
    "location": [
      -7.7542708,
      110.4058082
    ],
    "phone" : "(0274) 887494",
    "website" : "https://rs-condongcatur.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 89,
    "name": "Rumah Sakit Permata Husada",
    "address": "JL. Raya KM 4 RT, Kauman, Pleret, Kec. Pleret, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55791",
    "location": [
      -7.8657592,
      110.4082649
    ],
    "phone" : "(0274) 441313",
    "website" : "-",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 90,
    "name": "RSU Mitra Paramedika",
    "address": "Jl. Raya Ngemplak, Area Sawah, Widodomartani, Kec. Ngemplak, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55571",
    "location": [
      -7.7140698,
      110.4481859
    ],
    "phone" : "(0274) 4461098",
    "website" : "-",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 94,
    "name": "RSU Rachma Husada",
    "address": "JL. Parantritis, Km. 16, Gerselo Patalan, Jetis, Patalan, Bantul, Ketandan, Patalan, Kec. Jetis, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55781",
    "location": [
      -7.9318813,
      110.3460526
    ],
    "phone" : "(0274) 6460091",
    "website" : "https://rsurachmahusada.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 97,
    "name": "RSU Rajawali Citra",
    "address": "Jl. Pleret No.KM 2.5, Banjardadap, Potorono, Kec. Banguntapan, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55196",
    "location": [
      -7.8483302,
      110.4102422
    ],
    "phone" : "082134313535",
    "website" : "https://rsrcjogja.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 102,
    "name": "Rumah Sakit Siloam Yogyakarta",
    "address": "Jalan Laksda Adisucipto No.32-34, Demangan, Kec. Gondokusuman, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55221",
    "location": [
      -7.7833722,
      110.3908476
    ],
    "phone" : "1500911",
    "website" : "https://www.siloamhospitals.com",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 103,
    "name": "RS Nurrohmah",
    "address": "Jl. Jogja - Wonosari Jl. Bandung - Playen No.Km. 7, Jambu Rejo, Bandung, Kec. Playen, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta 55",
    "location": [
      -7.9224175,
      110.5614765
    ],
    "phone" : "-",
    "website" : "-",
    "bpjs": false,
    "igd": false
  },
  {
    "id": 105,
    "name": "RSU Pelita Husada",
    "address": "Jl. Raya Wonosari-Semanu No.Km.3, Sambirejo, Semanu, Kec. Semanu, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta 55893",
    "location": [
      -7.9891432,
      110.6320452
    ],
    "phone" : "(0274) 393444",
    "website" : "https://rsupelitahusada.com",
    "bpjs": true,
    "igd": true
  },
  {
    "id": 123,
    "name": "Rumah Sakit Khusus Bedah (RSKB) Sinduadi",
    "address": "Jalan Wijaya Kusuma, Jl. Patran Gg. Trini Tegal No.310, Sinduadi, Kec. Mlati, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55284",
    "location": [
      -7.7573565,
      110.3633677
    ],
    "phone" : "088216412177",
    "website" : "https://rskbsinduadi.co.id",
    "bpjs": false,
    "igd": true
  },
  {
    "id": 124,
    "name": "Rumah Sakit Panti Rahayu",
    "address": "Jl. Wonosari Ponjong KM. 7, Karangmojo, Kelor, Kec. Karangmojo, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta 55891",
    "location": [
      -7.956385,
      110.6580992
    ],
    "phone" : "(0274) 2901454",
    "website" : "http://www.pantirahayu.or.id",
    "bpjs": true,
    "igd": true
  },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="font-inter grid h-screen w-full grid-cols-1 md:grid-cols-[380px_1fr]">
      <!-- SIDEBAR -->
      <aside class="flex h-full flex-col bg-gray-50 p-4 shadow-lg md:overflow-y-auto">
        <h1 class="mb-4 text-2xl font-bold text-blue-700">Pencari RS Terdekat</h1>
        <p class="mb-4 text-sm text-gray-600">
          Aplikasi LBS untuk menemukan rumah sakit terdekat.
        </p>

        <!-- Search -->
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

        <!-- Filter -->
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

        <!-- Insight Spasial -->
        <div class="mb-4 space-y-2 rounded-lg bg-white p-3 shadow-sm">

          @if (!userLocation()) {
            <p class="text-sm text-gray-500">
              Menunggu lokasi Anda untuk menghitung rumah sakit terdekat...
            </p>
          } @else {
            @if (nearestHospitals().length > 0) {
              <p class="text-sm text-gray-700 leading-relaxed">
                Rumah sakit terdekat dari lokasi Anda adalah
                <span class="font-semibold text-blue-700">
                  {{ nearestHospitals()[0].hospital.name }}
                </span>,
                dengan jarak 
                <span class="font-semibold">
                  {{ nearestHospitals()[0].distanceKm | number:'1.1-1' }} km
                </span>.
              </p>
            } @else {
              <p class="text-sm text-gray-500">
                Tidak ada data rumah sakit untuk dihitung.
              </p>
            }
          }
        </div>


        <!-- List RS -->
        <div class="flex-1 space-y-3 overflow-y-auto pr-2">
          <h3 class="font-semibold text-gray-800">
            Hasil: ({{ filteredHospitals().length }})
          </h3>

          @if (filteredHospitals().length > 0) {
            @for (hospital of filteredHospitals(); track hospital.id) {
                <div
                  class="cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
                  (click)="onSelectHospital(hospital)"
                >
                <h4 class="font-bold text-blue-800">{{ hospital.name }}</h4>
                <p class="text-sm text-gray-600">{{ hospital.address }}</p>

                <div class="mt-2 flex items-center space-x-4">
                  @if (hospital.bpjs) {
                    <span
                      class="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                      >BPJS</span
                    >
                  }
                  @if (hospital.igd) {
                    <span
                      class="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700"
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
            }
          } @else {
            <p class="p-4 text-center text-gray-500">
              Tidak ada rumah sakit yang sesuai dengan filter pencarian Anda.
            </p>
          }
        </div>
      </aside>

      <!-- MAP -->
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

    aside div[class*='overflow-y-auto']::-webkit-scrollbar {
      width: 6px;
    }
    aside div[class*='overflow-y-auto']::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 3px;
    }
    aside div[class*='overflow-y-auto']::-webkit-scrollbar-track {
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

  private formatDuration(totalSeconds: number): string {
    const totalMinutes = Math.round(totalSeconds / 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    if (h > 0) {
      return `${h} jam ${m} menit`;
    }
    return `${m} menit`;
  }


  isLoadingLocation = signal<boolean>(true);
  userLocation = signal<any | null>(null);
  routingControl = signal<any | null>(null);
  locationError = signal<string | null>(null);

  private allHospitals = signal<Hospital[]>(HOSPITAL_DATA);
  searchTerm = signal<string>('');
  filters = signal<{ bpjs: boolean; igd: boolean }>({ bpjs: false, igd: false });

  // === hasil analisis spasial: TOP 5 RS terdekat ===
  nearestHospitals = signal<{ hospital: Hospital; distanceKm: number }[]>([]);

  filteredHospitals = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const { bpjs, igd } = this.filters();

    return this.allHospitals().filter((hospital) => {
      const nameMatch = hospital.name.toLowerCase().includes(term);
      const bpjsMatch = !bpjs || (bpjs && hospital.bpjs);
      const igdMatch = !igd || (igd && hospital.igd);
      return nameMatch && bpjsMatch && igdMatch;
    });
  });

  constructor() {
    // render ulang marker saat filter/search berubah
    effect(() => {
      this.plotHospitals(this.filteredHospitals());
    });

    // hitung RS terdekat saat lokasi user atau hasil filter berubah
    effect(() => {
      const _ = this.filteredHospitals(); // dependency
      const user = this.userLocation();

      if (!this.map || !user) {
        this.nearestHospitals.set([]);
        return;
      }

      this.updateNearestHospitals();
    });
  }

  onSelectHospital(hospital: Hospital): void {
  this.panToHospital(hospital);
  this.showRoute(hospital);
}

  // lifecycle
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

  // leaflet init
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
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }

  private initMap(): void {
    this.map = L.map('map').setView([-7.7951, 110.3695], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
        this.locationError.set(
          'Gagal mendapatkan lokasi. Pastikan izin lokasi/GPS aktif.'
        );
        this.cdr.detectChanges();
      });

    this.map.locate({ setView: true, maxZoom: 16, watch: true });
  }

  // plotting hospital markers
  private plotHospitals(hospitals: Hospital[]): void {
    const layer = this.hospitalMarkerLayer();
    if (!layer) return;

    layer.clearLayers();

    const hospitalIcon = L.icon({
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      shadowSize: [41, 41],
    });

    hospitals.forEach((hospital) => {
      L.marker(hospital.location, { icon: hospitalIcon })
        .addTo(layer)
        .bindPopup(`
          <div style="font-size:14px; line-height:1.4;">
            <b style="font-size:16px;">${hospital.name}</b><br>
            ${hospital.address}<br><br>

            ${hospital.phone ? `<b>📞 Telepon:</b> ${hospital.phone}<br>` : ''}
            ${hospital.website ? `<b>🌐 Website:</b> <a href="${hospital.website}" target="_blank">${hospital.website}</a><br>` : ''}
          </div>
        `)
        .on('click', () => {
          this.showRoute(hospital);
        });
    });
  }

  // === ANALISIS SPASIAL: hitung TOP 5 RS terdekat ===
  private updateNearestHospitals(): void {
    const user = this.userLocation();
    if (!user || !this.map) {
      this.nearestHospitals.set([]);
      return;
    }

    const userLatLng = L.latLng(user.lat, user.lng);

    const result = this.filteredHospitals()
      .map((hospital) => {
        const hospitalLatLng = L.latLng(
          hospital.location[0],
          hospital.location[1],
        );
        const distanceMeters = this.map.distance(userLatLng, hospitalLatLng);

        return {
          hospital,
          distanceKm: distanceMeters / 1000,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 5);

    this.nearestHospitals.set(result);
  }

  // routing
  showRoute(hospital: Hospital): void {
    const userLoc = this.userLocation();

    // 1. Validasi lokasi user dulu
    if (!userLoc) {
      this.locationError.set('Lokasi Anda belum ditemukan. Mohon tunggu...');
      this.cdr.detectChanges();
      return;
    }

    // 2. Bersihkan rute sebelumnya
    this.clearRoute();

    // 3. Siapkan waypoints
    const from = L.latLng(userLoc.lat, userLoc.lng);
    const to   = L.latLng(hospital.location[0], hospital.location[1]);

    // 4. Buat routing control baru
    const routing = (L as any).Routing.control({
      waypoints: [from, to],
      routeWhileDragging: false,
      show: false,
      showAlternatives: true,
      lineOptions: {
        styles: [{ color: '#007BFF', opacity: 0.9, weight: 6 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      altLineOptions: {
        styles: [{ color: '#9CA3AF', opacity: 0.7, weight: 4, dashArray: '4 8' }],
      },
      createMarker: () => null,
    }).addTo(this.map);

    // 5. Ketika rute sudah ditemukan → ambil jarak & waktu tempuh
    routing.on('routesfound', (e: any) => {
      const route = e.routes?.[0];
      if (!route?.summary) return;

      const distanceKm   = route.summary.totalDistance / 1000;
      const durationText = this.formatDuration(route.summary.totalTime);

      const popupHtml = `
        <div style="font-size:14px; line-height:1.4;">
          <b style="font-size:16px;">${hospital.name}</b><br>
          ${hospital.address}<br><br>

          ${hospital.phone ? `<b>📞 Telepon:</b> ${hospital.phone}<br>` : ''}
          ${hospital.website ? `<b>🌐 Website:</b> <a href="${hospital.website}" target="_blank">${hospital.website}</a><br>` : ''}

          <br>
          <b>🚗 Jarak rute:</b> ${distanceKm.toFixed(1)} km<br>
          <b>⏱️ Perkiraan waktu tempuh:</b> ${durationText}
        </div>
      `;

      L.popup()
        .setLatLng(to)
        .setContent(popupHtml)
        .openOn(this.map);
    });

    this.routingControl.set(routing);
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
          layer.getLatLng().lng === hospital.location[1],
      )
      ?.openPopup();
  }

  // search & filter handler
  updateSearch(event: any): void {
    this.searchTerm.set(event.target.value);
  }

  updateFilter(filter: 'bpjs' | 'igd', value: boolean): void {
    this.filters.update((current) => ({
      ...current,
      [filter]: value,
    }));
  }

  // user marker icon
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
