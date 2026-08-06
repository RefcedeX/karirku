export type Kampus = {
  id: string;
  name: string;
  short_name: string;
  location: string;
  type: 'PTN' | 'PTS' | 'Kedinasan';
  accreditation: 'Unggul' | 'A' | 'B' | 'Baik Sekali' | 'Baik';
  website: string;
  logoUrl?: string;
  popular_majors: string[];
  snbt_average: number;
};

export const KAMPUS_DATA: Kampus[] = [
  {
    id: 'ui',
    name: 'Universitas Indonesia',
    short_name: 'UI',
    location: 'Depok, Jawa Barat',
    type: 'PTN',
    accreditation: 'Unggul',
    website: 'https://www.ui.ac.id',
    popular_majors: ['Pendidikan Dokter', 'Ilmu Hukum', 'Ilmu Komputer', 'Manajemen', 'Psikologi'],
    snbt_average: 720
  },
  {
    id: 'itb',
    name: 'Institut Teknologi Bandung',
    short_name: 'ITB',
    location: 'Bandung, Jawa Barat',
    type: 'PTN',
    accreditation: 'Unggul',
    website: 'https://www.itb.ac.id',
    popular_majors: ['Sekolah Teknik Elektro & Informatika (STEI)', 'Fakultas Teknik Pertambangan & Perminyakan (FTTM)', 'Fakultas Teknologi Industri (FTI)'],
    snbt_average: 735
  },
  {
    id: 'ugm',
    name: 'Universitas Gadjah Mada',
    short_name: 'UGM',
    location: 'Yogyakarta, DIY',
    type: 'PTN',
    accreditation: 'Unggul',
    website: 'https://ugm.ac.id',
    popular_majors: ['Kedokteran', 'Psikologi', 'Hukum', 'Teknologi Informasi', 'Manajemen'],
    snbt_average: 715
  },
  {
    id: 'unpad',
    name: 'Universitas Padjadjaran',
    short_name: 'UNPAD',
    location: 'Sumedang, Jawa Barat',
    type: 'PTN',
    accreditation: 'Unggul',
    website: 'https://www.unpad.ac.id',
    popular_majors: ['Ilmu Komunikasi', 'Kedokteran', 'Hukum', 'Psikologi', 'Manajemen'],
    snbt_average: 680
  },
  {
    id: 'upi',
    name: 'Universitas Pendidikan Indonesia',
    short_name: 'UPI',
    location: 'Bandung, Jawa Barat',
    type: 'PTN',
    accreditation: 'Unggul',
    website: 'https://www.upi.edu',
    popular_majors: ['Psikologi', 'Ilmu Komunikasi', 'Pendidikan Guru Sekolah Dasar (PGSD)', 'Manajemen', 'Pendidikan Bahasa Inggris'],
    snbt_average: 650
  },
  {
    id: 'untirta',
    name: 'Universitas Sultan Ageng Tirtayasa',
    short_name: 'UNTIRTA',
    location: 'Serang, Banten',
    type: 'PTN',
    accreditation: 'Unggul',
    website: 'https://untirta.ac.id',
    popular_majors: ['Hukum', 'Manajemen', 'Pendidikan Dokter', 'Ilmu Komunikasi', 'Teknik Industri'],
    snbt_average: 620
  },
  {
    id: 'ipb',
    name: 'Institut Pertanian Bogor',
    short_name: 'IPB University',
    location: 'Bogor, Jawa Barat',
    type: 'PTN',
    accreditation: 'Unggul',
    website: 'https://ipb.ac.id',
    popular_majors: ['Ilmu Komputer', 'Teknologi Pangan', 'Ilmu Gizi', 'Agribisnis', 'Kedokteran Hewan'],
    snbt_average: 690
  },
  {
    id: 'undip',
    name: 'Universitas Diponegoro',
    short_name: 'UNDIP',
    location: 'Semarang, Jawa Tengah',
    type: 'PTN',
    accreditation: 'Unggul',
    website: 'https://www.undip.ac.id',
    popular_majors: ['Hukum', 'Kedokteran', 'Kesehatan Masyarakat', 'Ilmu Komunikasi', 'Psikologi'],
    snbt_average: 685
  }
];
