import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from '../hooks/useTranslation';
import {
  VFPageContainer,
  VFPageToolbar,
  VFStatCard,
  VFDataTable,
  VFButton,
  VFCard,
  VFInput,
  VFSelect,
  VFTabs,
  VFBadge,
} from '@vidyamaxx/ui';
import {
  FolderGit,
  FileText,
  Video,
  BookOpen,
  Link,
  Users,
  Download,
  SlidersHorizontal,
  Plus,
  BarChart3,
  Lock,
  Layers,
} from 'lucide-react';

export const Route = createFileRoute('/resources')({
  component: ResourcesPage,
});

function ResourcesPage() {
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  const [activeSubmodule, setActiveSubmodule] = React.useState<string>('dashboard');

  const resourceData = [
    { code: 'RES-PHYS-101', title: 'Electromagnetism Lecture Notes PDF', type: 'PDF Document', subject: 'Physics', class: 'Class 10-A', downloads: 142, status: 'Active' },
    { code: 'RES-MATH-102', title: 'Quadratic Equations Practice Sheet', type: 'Worksheet', subject: 'Mathematics', class: 'Class 9-B', downloads: 98, status: 'Active' },
    { code: 'RES-CHEM-103', title: 'Chemical Bonding Video Tutorial', type: 'Video Lesson', subject: 'Chemistry', class: 'Class 10-A', downloads: 210, status: 'Active' },
  ];

  const resourceColumns = [
    { header: isHindi ? 'रिसोर्स कोड' : 'Resource Code', accessorKey: 'code', align: 'center' as const, className: 'w-36 text-center', cell: (r: any) => <span className="font-mono font-bold text-primary">{r.code}</span> },
    { header: isHindi ? 'रिसोर्स शीर्षक' : 'Resource Title', accessorKey: 'title', cell: (r: any) => <span className="font-bold text-foreground">{r.title}</span> },
    { header: isHindi ? 'कंटेंट प्रकार' : 'Content Type', accessorKey: 'type', align: 'center' as const, className: 'w-36 text-center', cell: (r: any) => <VFBadge variant="outline">{r.type}</VFBadge> },
    { header: t('col.subject'), accessorKey: 'subject' },
    { header: isHindi ? 'कक्षा' : 'Target Grade', accessorKey: 'class' },
    { header: isHindi ? 'डाउनलोड्स / व्यूज' : 'Downloads / Views', accessorKey: 'downloads', align: 'center' as const, className: 'w-36 text-center', cell: (r: any) => <span className="font-mono font-bold text-emerald-500">{r.downloads}</span> },
    { header: t('col.status'), accessorKey: 'status', align: 'center' as const, className: 'w-28 text-center', cell: (r: any) => <VFBadge variant="success">{r.status}</VFBadge> },
  ];

  // ----------------------------------------------------
  // SUBMODULE 1 — Learning Dashboard
  // ----------------------------------------------------
  const dashboardContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <VFStatCard title="Total Uploaded Resources" value="482 Files" icon={<FolderGit className="h-5 w-5" />} trend="up" trendLabel="+24 This Month" accentColor="primary" />
        <VFStatCard title="Total Downloads" value="8,420 Views" icon={<Download className="h-5 w-5" />} trend="up" trendLabel="High Student Usage" accentColor="emerald" />
        <VFStatCard title="Video Tutorials" value="64 Videos" icon={<Video className="h-5 w-5" />} trend="neutral" trendLabel="1080p HD Lectures" accentColor="amber" />
        <VFStatCard title="Digital E-books" value="38 E-books" icon={<BookOpen className="h-5 w-5" />} trend="neutral" trendLabel="NCERT & Ref Books" accentColor="purple" />
      </div>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 2 — Notes
  // ----------------------------------------------------
  const notesContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-card border border-border p-3.5 rounded-md shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-foreground">Teacher Revision Notes Directory</h3>
          <p className="text-xs text-muted-foreground">Classroom lecture notes, summary cheat-sheets, and formula guides.</p>
        </div>
        <VFButton size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Upload Notes</VFButton>
      </div>
      <VFDataTable columns={resourceColumns} data={resourceData} filterPlaceholder="Search notes title..." />
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 3 — Study Materials
  // ----------------------------------------------------
  const studyMaterialsContent = (
    <div className="space-y-4">
      <VFCard title="Subject Study Material & Reference Packs">
        <p className="text-xs text-muted-foreground mb-3">Chapter-wise study packs, solved sample papers, and lab manuals.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 4 — PDFs & Documents
  // ----------------------------------------------------
  const pdfsDocumentsContent = (
    <div className="space-y-4">
      <VFCard title="PDF Documents & Digital Worksheet Repository">
        <p className="text-xs text-muted-foreground mb-3">Downloadable PDF files with embedded OCR text and search indexing.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 5 — Videos
  // ----------------------------------------------------
  const videosContent = (
    <div className="space-y-4">
      <VFCard title="Video Tutorials & Animated Concept Lectures">
        <p className="text-xs text-muted-foreground mb-3">Recorded classroom lectures, 3D animated science demonstrations, and experiment clips.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 6 — E-books
  // ----------------------------------------------------
  const ebooksContent = (
    <div className="space-y-4">
      <VFCard title="Digital E-Book Library & NCERT Textbooks">
        <p className="text-xs text-muted-foreground mb-3">Interactive e-textbooks with chapter bookmarks and highlighting tools.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 7 — External Links
  // ----------------------------------------------------
  const externalLinksContent = (
    <div className="space-y-4">
      <VFCard title="Curated External Educational Web Links & Simulations">
        <p className="text-xs text-muted-foreground mb-3">Links to PhET interactive simulations, Khan Academy, and national digital portals.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 8 — Subject Resources
  // ----------------------------------------------------
  const subjectResourcesContent = (
    <div className="space-y-4">
      <VFCard title="Subject-wise Filtered Resource Repository">
        <p className="text-xs text-muted-foreground mb-3 font-mono">Organize files by Mathematics, Science, Humanities, Commerce, and Languages.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 9 — Chapter Resources
  // ----------------------------------------------------
  const chapterResourcesContent = (
    <div className="space-y-4">
      <VFCard title="Chapter-Level Resource Allocation">
        <p className="text-xs text-muted-foreground mb-3">Map study materials directly to individual curriculum chapters.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 10 — Teacher Resources
  // ----------------------------------------------------
  const teacherResourcesContent = (
    <div className="space-y-4">
      <VFCard title="Faculty Preparation Materials & Answer Keys">
        <p className="text-xs text-muted-foreground mb-3">Teacher solution keys, presentation slides, and curriculum guides.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 11 — Shared Resources
  // ----------------------------------------------------
  const sharedResourcesContent = (
    <div className="space-y-4">
      <VFCard title="Inter-School & Campus Shared Resources">
        <p className="text-xs text-muted-foreground mb-3">Shared resource library accessible across multiple campus branches.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 12 — Learning Collections
  // ----------------------------------------------------
  const collectionsContent = (
    <div className="space-y-4">
      <VFCard title="Curated Learning Collections & Exam Prep Playlists">
        <p className="text-xs text-muted-foreground mb-3">Grouped collections (e.g. "Class 10 Board Exam Crash Course Pack").</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 13 — Resource Access
  // ----------------------------------------------------
  const accessContent = (
    <div className="space-y-4">
      <VFCard title="Role-Based Resource Permissions & DRM Control">
        <p className="text-xs text-muted-foreground mb-3 font-mono font-bold">Restrict download permissions by grade level, student house, or fee clearance.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 14 — Resource Analytics
  // ----------------------------------------------------
  const analyticsContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <VFStatCard title="Most Downloaded PDF" value="Physics Ch 4 Notes" icon={<Download className="h-5 w-5" />} trend="up" trendLabel="412 Downloads" accentColor="emerald" />
        <VFStatCard title="Most Viewed Video" value="Quadratic Eq Lesson" icon={<Video className="h-5 w-5" />} trend="up" trendLabel="680 Views" accentColor="primary" />
        <VFStatCard title="Active Student Viewers" value="1,120 Students" icon={<Users className="h-5 w-5" />} trend="neutral" trendLabel="Active This Week" accentColor="amber" />
        <VFStatCard title="Avg Viewing Duration" value="18 Minutes" icon={<BarChart3 className="h-5 w-5" />} trend="neutral" trendLabel="Per Session" accentColor="purple" />
      </div>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 15 — Learning Settings
  // ----------------------------------------------------
  const settingsContent = (
    <div className="space-y-4">
      <VFCard title="Global Learning Resource Settings">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-2">
          <VFInput label="Max File Upload Limit" defaultValue="50 MB" />
          <VFSelect label="Allowed File Formats" options={[{ label: 'PDF, MP4, PNG, DOCX, EPUB', value: 'all' }, { label: 'PDF & Video Only', value: 'pdf_video' }]} />
        </div>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // ALL 15 SUBMODULE TABS MAPPED
  // ----------------------------------------------------
  const submoduleTabs = [
    { id: 'dashboard', label: isHindi ? 'लर्निंग डैशबोर्ड' : 'Learning Dashboard', icon: <BarChart3 className="h-3.5 w-3.5" />, content: dashboardContent },
    { id: 'notes', label: isHindi ? 'नोट्स' : 'Notes', icon: <FileText className="h-3.5 w-3.5" />, content: notesContent },
    { id: 'study-materials', label: isHindi ? 'स्टडी मटेरियल' : 'Study Materials', icon: <BookOpen className="h-3.5 w-3.5" />, content: studyMaterialsContent },
    { id: 'pdfs-documents', label: isHindi ? 'PDFs & डॉक्यूमेंट्स' : 'PDFs & Documents', icon: <FileText className="h-3.5 w-3.5" />, content: pdfsDocumentsContent },
    { id: 'videos', label: isHindi ? 'वीडियोज' : 'Videos', icon: <Video className="h-3.5 w-3.5" />, content: videosContent },
    { id: 'ebooks', label: isHindi ? 'ई-बुक्स' : 'E-books', icon: <BookOpen className="h-3.5 w-3.5" />, content: ebooksContent },
    { id: 'external-links', label: isHindi ? 'एक्सटर्नल लिंक्स' : 'External Links', icon: <Link className="h-3.5 w-3.5" />, content: externalLinksContent },
    { id: 'subject-resources', label: isHindi ? 'विषय संसाधन' : 'Subject Resources', icon: <Layers className="h-3.5 w-3.5" />, content: subjectResourcesContent },
    { id: 'chapter-resources', label: isHindi ? 'अध्याय संसाधन' : 'Chapter Resources', icon: <FolderGit className="h-3.5 w-3.5" />, content: chapterResourcesContent },
    { id: 'teacher-resources', label: isHindi ? 'टीचर रिसोर्सेज' : 'Teacher Resources', icon: <Users className="h-3.5 w-3.5" />, content: teacherResourcesContent },
    { id: 'shared-resources', label: isHindi ? 'शेयर्ड संसाधन' : 'Shared Resources', icon: <Users className="h-3.5 w-3.5" />, content: sharedResourcesContent },
    { id: 'collections', label: isHindi ? 'लर्निंग कलेक्शंस' : 'Learning Collections', icon: <Layers className="h-3.5 w-3.5" />, content: collectionsContent },
    { id: 'access', label: isHindi ? 'रिसोर्स एक्सेस' : 'Resource Access', icon: <Lock className="h-3.5 w-3.5" />, content: accessContent },
    { id: 'analytics', label: isHindi ? 'रिसोर्स एनालिटिक्स' : 'Resource Analytics', icon: <BarChart3 className="h-3.5 w-3.5" />, content: analyticsContent },
    { id: 'settings', label: isHindi ? 'लर्निंग सेटिंग्स' : 'Learning Settings', icon: <SlidersHorizontal className="h-3.5 w-3.5" />, content: settingsContent },
  ];

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* 1. Header Toolbar Box */}
      <VFPageToolbar>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <FolderGit className="h-4 w-4" />
          </div>
          <span className="text-base font-extrabold text-foreground tracking-tight">
            {t('nav.resources')}
          </span>
          <VFBadge variant="success" className="text-[10px] font-bold font-mono">
            Cloud Repository
          </VFBadge>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <VFButton
            size="sm"
            className="h-9 px-3.5 text-xs font-bold shadow-xs"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setActiveSubmodule('notes')}
          >
            {isHindi ? 'रिसोर्स अपलोड करें' : 'Upload Resource'}
          </VFButton>
        </div>
      </VFPageToolbar>

      <VFTabs
        items={submoduleTabs}
        activeTabId={activeSubmodule}
        onTabChange={setActiveSubmodule}
        variant="top-bar"
      />
    </VFPageContainer>
  );
}
