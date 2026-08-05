'use client'

import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer'

interface EducationItem {
  school: string
  major: string
  startDate: string
  endDate: string
  activities: string
}

interface ExperienceItem {
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
}

interface CVData {
  name: string
  email: string
  phone: string
  address: string
  website?: string
  summary: string
  skills: string
  education: EducationItem[]
  experience: ExperienceItem[]
}

// ---------------- Helper for Bullet Points ----------------
const renderBullets = (text: string, textStyle: any) => {
  if (!text) return null;
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  return lines.map((line, idx) => {
    let cleanLine = line.trim();
    if (cleanLine.startsWith('-')) cleanLine = cleanLine.substring(1).trim();
    if (cleanLine.startsWith('•')) cleanLine = cleanLine.substring(1).trim();
    
    return (
      <View key={idx} style={{ flexDirection: 'row', marginBottom: 2 }}>
        <Text style={{ ...textStyle, width: 10 }}>•</Text>
        <Text style={{ ...textStyle, flex: 1 }}>{cleanLine}</Text>
      </View>
    )
  })
}

// ---------------- ATS Styles ----------------
const atsStyles = StyleSheet.create({
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
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  contact: {
    fontSize: 10,
    color: '#000',
    marginBottom: 2,
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottom: '1pt solid #000',
    paddingBottom: 2,
    textTransform: 'uppercase',
  },
  itemBlock: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#333',
  },
  itemDate: {
    fontSize: 10,
    color: '#555',
  },
  itemDesc: {
    fontSize: 10,
    marginTop: 4,
    lineHeight: 1.5,
  },
})

// ---------------- Creative Styles ----------------
const creativeStyles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  sidebar: {
    width: '35%',
    backgroundColor: '#2D3748',
    color: '#FFFFFF',
    padding: 30,
    height: '100%',
  },
  main: {
    width: '65%',
    padding: 30,
    backgroundColor: '#F7FAFC',
    height: '100%',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2B6CB0',
  },
  role: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sidebarTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#63B3ED',
    textTransform: 'uppercase',
    borderBottom: '1pt solid #4A5568',
    paddingBottom: 4,
  },
  sidebarText: {
    fontSize: 10,
    marginBottom: 5,
    color: '#E2E8F0',
    lineHeight: 1.4,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#2D3748',
    textTransform: 'uppercase',
    borderBottom: '2pt solid #CBD5E0',
    paddingBottom: 4,
  },
  itemBlock: {
    marginBottom: 12,
  },
  itemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  itemDate: {
    fontSize: 9,
    color: '#A0AEC0',
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#4A5568',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  mainText: {
    fontSize: 10,
    color: '#4A5568',
    lineHeight: 1.5,
  }
})

export function CVDocument({ data, template = 'ats' }: { data: CVData, template?: 'ats' | 'creative' }) {
  // Safe default for empty arrays in case of migration issue
  const eduArray = Array.isArray(data.education) ? data.education : []
  const expArray = Array.isArray(data.experience) ? data.experience : []

  if (template === 'creative') {
    return (
      <Document>
        <Page size="A4" style={creativeStyles.page}>
          <View style={creativeStyles.sidebar}>
            <Text style={creativeStyles.sidebarTitle}>Kontak</Text>
            <Text style={creativeStyles.sidebarText}>{data.email || 'email@contoh.com'}</Text>
            <Text style={creativeStyles.sidebarText}>{data.phone || '0812-3456-7890'}</Text>
            <Text style={creativeStyles.sidebarText}>{data.address || 'Alamat Lengkap'}</Text>
            {data.website && <Text style={creativeStyles.sidebarText}>{data.website}</Text>}

            <Text style={creativeStyles.sidebarTitle}>Keahlian</Text>
            <Text style={creativeStyles.sidebarText}>{data.skills || 'Sebutkan hardskill dan softskill yang kamu miliki.'}</Text>
          </View>
          
          <View style={creativeStyles.main}>
            <Text style={creativeStyles.name}>{data.name || 'Nama Lengkap'}</Text>
            <Text style={creativeStyles.role}>Profesional Kreatif</Text>
            
            <View>
              <Text style={creativeStyles.mainTitle}>Profil Singkat</Text>
              <Text style={creativeStyles.mainText}>{data.summary || 'Tuliskan profil singkat, minat, dan objektif kariermu di sini...'}</Text>
            </View>

            <View>
              <Text style={creativeStyles.mainTitle}>Pengalaman & Organisasi</Text>
              {expArray.length === 0 && <Text style={creativeStyles.mainText}>Tuliskan pengalaman organisasi, kepanitiaan, atau proyek sekolahmu.</Text>}
              {expArray.map((exp, idx) => (
                <View key={idx} style={creativeStyles.itemBlock}>
                  <View style={creativeStyles.itemTitleRow}>
                    <Text style={creativeStyles.itemTitle}>{exp.company || 'Nama Perusahaan/Organisasi'}</Text>
                    <Text style={creativeStyles.itemDate}>{(exp.startDate || exp.endDate) ? `${exp.startDate} - ${exp.endDate}` : ''}</Text>
                  </View>
                  {exp.role && <Text style={creativeStyles.itemSubtitle}>{exp.role}</Text>}
                  {renderBullets(exp.description, creativeStyles.mainText)}
                </View>
              ))}
            </View>

            <View>
              <Text style={creativeStyles.mainTitle}>Pendidikan</Text>
              {eduArray.length === 0 && <Text style={creativeStyles.mainText}>Tuliskan riwayat pendidikanmu.</Text>}
              {eduArray.map((edu, idx) => (
                <View key={idx} style={creativeStyles.itemBlock}>
                  <View style={creativeStyles.itemTitleRow}>
                    <Text style={creativeStyles.itemTitle}>{edu.school || 'Nama Sekolah/Kampus'}</Text>
                    <Text style={creativeStyles.itemDate}>{(edu.startDate || edu.endDate) ? `${edu.startDate} - ${edu.endDate}` : ''}</Text>
                  </View>
                  {edu.major && <Text style={creativeStyles.itemSubtitle}>{edu.major}</Text>}
                  {renderBullets(edu.activities, creativeStyles.mainText)}
                </View>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    )
  }

  // ATS Model (Default)
  return (
    <Document>
      <Page size="A4" style={atsStyles.page}>
        <View style={atsStyles.header}>
          <Text style={atsStyles.name}>{data.name || 'Nama Lengkap'}</Text>
          <Text style={atsStyles.contact}>
            {data.email || 'email@contoh.com'} • {data.phone || '0812-3456-7890'} 
            {data.website ? ` • ${data.website}` : ''}
          </Text>
          <Text style={atsStyles.contact}>{data.address || 'Alamat Lengkap'}</Text>
        </View>

        <View style={atsStyles.section}>
          <Text style={atsStyles.sectionTitle}>Profil Singkat</Text>
          <Text style={atsStyles.itemDesc}>{data.summary || 'Tuliskan profil singkat, minat, dan objektif kariermu di sini...'}</Text>
        </View>

        <View style={atsStyles.section}>
          <Text style={atsStyles.sectionTitle}>Pendidikan</Text>
          {eduArray.length === 0 && <Text style={atsStyles.itemDesc}>Tuliskan riwayat pendidikan, jurusan, dan tahun.</Text>}
          {eduArray.map((edu, idx) => (
            <View key={idx} style={atsStyles.itemBlock}>
              <View style={atsStyles.itemHeader}>
                <View>
                  <Text style={atsStyles.itemTitle}>{edu.school || 'Nama Sekolah/Kampus'}</Text>
                  {edu.major && <Text style={atsStyles.itemSubtitle}>{edu.major}</Text>}
                </View>
                <Text style={atsStyles.itemDate}>{(edu.startDate || edu.endDate) ? `${edu.startDate} - ${edu.endDate}` : ''}</Text>
              </View>
              <View style={{ marginTop: 4 }}>
                {renderBullets(edu.activities, atsStyles.itemDesc)}
              </View>
            </View>
          ))}
        </View>

        <View style={atsStyles.section}>
          <Text style={atsStyles.sectionTitle}>Pengalaman & Organisasi</Text>
          {expArray.length === 0 && <Text style={atsStyles.itemDesc}>Tuliskan pengalaman organisasi, kepanitiaan, atau proyek sekolahmu.</Text>}
          {expArray.map((exp, idx) => (
            <View key={idx} style={atsStyles.itemBlock}>
              <View style={atsStyles.itemHeader}>
                <View>
                  <Text style={atsStyles.itemTitle}>{exp.company || 'Nama Perusahaan/Organisasi'}</Text>
                  {exp.role && <Text style={atsStyles.itemSubtitle}>{exp.role}</Text>}
                </View>
                <Text style={atsStyles.itemDate}>{(exp.startDate || exp.endDate) ? `${exp.startDate} - ${exp.endDate}` : ''}</Text>
              </View>
              <View style={{ marginTop: 4 }}>
                {renderBullets(exp.description, atsStyles.itemDesc)}
              </View>
            </View>
          ))}
        </View>

        <View style={atsStyles.section}>
          <Text style={atsStyles.sectionTitle}>Keahlian (Skills)</Text>
          <Text style={atsStyles.itemDesc}>{data.skills || 'Sebutkan hardskill dan softskill yang kamu miliki.'}</Text>
        </View>
      </Page>
    </Document>
  )
}
