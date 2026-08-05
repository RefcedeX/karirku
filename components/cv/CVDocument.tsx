'use client'

import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer'

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2pt solid #000',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contact: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
    padding: 4,
  },
  item: {
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#444',
  },
  itemDesc: {
    fontSize: 10,
    marginTop: 4,
    lineHeight: 1.4,
  },
})

interface CVData {
  name: string
  email: string
  phone: string
  address: string
  summary: string
  skills: string
  education: string
  experience: string
}

export function CVDocument({ data }: { data: CVData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.name || 'Nama Lengkap'}</Text>
          <Text style={styles.contact}>{data.email || 'email@contoh.com'} • {data.phone || '0812-3456-7890'}</Text>
          <Text style={styles.contact}>{data.address || 'Alamat Lengkap'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil Singkat</Text>
          <Text style={styles.itemDesc}>{data.summary || 'Tuliskan profil singkat, minat, dan objektif kariermu di sini...'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pendidikan</Text>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>SMAN 1 BAROS</Text>
            <Text style={styles.itemSubtitle}>Siswa Aktif • {new Date().getFullYear()}</Text>
            <Text style={styles.itemDesc}>{data.education || 'Jurusan / Mapel Pilihan...'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengalaman & Organisasi</Text>
          <View style={styles.item}>
            <Text style={styles.itemDesc}>{data.experience || 'Tuliskan pengalaman organisasi, kepanitiaan, atau proyek sekolahmu.'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Keahlian (Skills)</Text>
          <Text style={styles.itemDesc}>{data.skills || 'Sebutkan hardskill dan softskill yang kamu miliki.'}</Text>
        </View>
      </Page>
    </Document>
  )
}
