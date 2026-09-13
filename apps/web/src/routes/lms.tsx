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
  Laptop,
  Video,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  SlidersHorizontal,
  Plus,
  Download,
  Share2,
  PlayCircle,
  History,
  BarChart3,
} from 'lucide-react';

export const Route = createFileRoute('/lms')({
  component: OnlineClassesPage,
});

function OnlineClassesPage() {
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  const [activeSubmodule, setActiveSubmodule] = React.useState<string>('dashboard');

  const classData = [
    { code: 'VIRT-101', title: 'Class 10 Physics Optics Revision', host: 'Dr. Sarah Connor', time: '10:00 AM – 11:00 AM', platform: 'VidyaClass Live', attendees: 38, status: 'Live Now' },
    { code: 'VIRT-102', title: 'Class 9 Math Geometry Problem Solving', host: 'Prof. Rajesh Sharma', time: '02:00 PM – 03:00 PM', platform: 'VidyaClass Live', attendees: 0, status: 'Upcoming' },
    { code: 'VIRT-103', title: 'Class 11 Chemistry Lab Demonstration', host: 'Mr. Vikram Singh', time: 'Yesterday, 11:00 AM', platform: 'Recorded', attendees: 34, status: 'Recorded' },
  ];

  const classColumns = [
    { header: isHindi ? 'क्लास कोड' : 'Class Code', accessorKey: 'code', align: 'center' as const, className: 'w-28 text-center', cell: (r: any) => <span className="font-mono font-bold text-primary">{r.code}</span> },
    { header: isHindi ? 'सेशन टाइटल' : 'Session Title', accessorKey: 'title', cell: (r: any) => <span className="font-bold text-foreground">{r.title}</span> },
    { header: isHindi ? 'इंस्ट्रक्टर / टीचर' : 'Instructor', accessorKey: 'host' },
    { header: isHindi ? 'शेड्यूल्ड समय' : 'Scheduled Time', accessorKey: 'time' },
    { header: isHindi ? 'प्लेटफ़ॉर्म / प्रकार' : 'Platform / Type', accessorKey: 'platform', align: 'center' as const, className: 'w-36 text-center', cell: (r: any) => <VFBadge variant="outline">{r.platform}</VFBadge> },
    { header: isHindi ? 'अटेंडीज' : 'Attendees', accessorKey: 'attendees', align: 'center' as const, className: 'w-28 text-center', cell: (r: any) => `${r.attendees} Students` },
    { header: t('col.status'), accessorKey: 'status', align: 'center' as const, className: 'w-28 text-center', cell: (r: any) => <VFBadge variant={r.status === 'Live Now' ? 'danger' : r.status === 'Upcoming' ? 'primary' : 'success'}>{r.status}</VFBadge> },
  ];

  // ----------------------------------------------------
  // SUBMODULE 1 — Online Class Dashboard
  // ----------------------------------------------------
  const dashboardContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <VFStatCard title="Live Classes Running" value="2 Classes" icon={<Video className="h-5 w-5" />} trend="up" trendLabel="76 Active Students" accentColor="rose" />
        <VFStatCard title="Today's Sessions" value="8 Classes" icon={<Calendar className="h-5 w-5" />} trend="neutral" trendLabel="Scheduled Today" accentColor="primary" />
        <VFStatCard title="Recorded Lectures" value="142 Videos" icon={<PlayCircle className="h-5 w-5" />} trend="up" trendLabel="Available On-Demand" accentColor="emerald" />
        <VFStatCard title="Avg Virtual Attendance" value="92.4%" icon={<CheckCircle2 className="h-5 w-5" />} trend="up" trendLabel="High Participation" accentColor="purple" />
      </div>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 2 — Class Schedule
  // ----------------------------------------------------
  const scheduleContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-card border border-border p-3.5 rounded-md shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-foreground">Virtual Class Timetable & Meeting Calendar</h3>
          <p className="text-xs text-muted-foreground">Daily schedule of live video lectures and interactive sessions.</p>
        </div>
        <VFButton size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Schedule Online Class</VFButton>
      </div>
      <VFDataTable columns={classColumns} data={classData} filterPlaceholder="Search session title..." />
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 3 — Create Online Class
  // ----------------------------------------------------
  const createClassContent = (
    <div className="space-y-4">
      <VFCard title="Create & Schedule Virtual Classroom Session">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-2">
          <VFInput label="Session Title" placeholder="e.g. Class 10 Physics Revision" />
          <VFSelect label="Target Grade & Section" options={[{ label: 'Class 10 - Section A', value: '10A' }, { label: 'Class 9 - Section B', value: '9B' }]} />
          <VFInput label="Start Time" defaultValue="10:00 AM" />
          <VFSelect label="Platform Engine" options={[{ label: 'VidyaClass Live (WebRTC HD)', value: 'webrtc' }, { label: 'Zoom Integration', value: 'zoom' }, { label: 'Google Meet', value: 'gmeet' }]} />
        </div>
        <VFButton size="sm" className="mt-4" leftIcon={<Video className="h-3.5 w-3.5" />}>Launch Live Class Room</VFButton>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 4 — Live Classes
  // ----------------------------------------------------
  const liveClassesContent = (
    <div className="space-y-4">
      <VFCard title="Active Live Video Rooms & Breakout Sessions">
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-md flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-foreground">🔴 Class 10 Physics Optics Revision (LIVE NOW)</span>
            <p className="text-muted-foreground text-xs mt-0.5">Instructor: Dr. Sarah Connor · 38 Students Connected</p>
          </div>
          <VFButton size="sm" leftIcon={<Video className="h-3.5 w-3.5" />}>Join Live Room</VFButton>
        </div>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 5 — Meeting Management
  // ----------------------------------------------------
  const meetingManagementContent = (
    <div className="space-y-4">
      <VFCard title="Live Host Controls & Participant Moderation">
        <p className="text-xs text-muted-foreground mb-3 font-mono">Mute participants, manage waiting rooms, hand raises, and chat privileges.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 6 — Online Attendance
  // ----------------------------------------------------
  const attendanceContent = (
    <div className="space-y-4">
      <VFCard title="Automated Virtual Join/Leave Timestamp Attendance">
        <p className="text-xs text-muted-foreground mb-3">Auto-captured online attendance log with connection duration tracking.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 7 — Class Materials
  // ----------------------------------------------------
  const classMaterialsContent = (
    <div className="space-y-4">
      <VFCard title="In-Class Shared Digital Handouts & Documents">
        <p className="text-xs text-muted-foreground mb-3">Instant file sharing during live virtual class sessions.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 8 — Screen/Content Sharing
  // ----------------------------------------------------
  const contentSharingContent = (
    <div className="space-y-4">
      <VFCard title="Interactive Screen Sharing & Digital Whiteboard Studio">
        <p className="text-xs text-muted-foreground mb-3">Dual-screen sharing, multi-user whiteboard drawing, and presentation slides.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 9 — Recordings
  // ----------------------------------------------------
  const recordingsContent = (
    <div className="space-y-4">
      <VFCard title="Cloud Session Recording & Auto-Transcription Processing">
        <p className="text-xs text-muted-foreground mb-3 font-mono">Auto-saves live lectures to cloud storage with automated transcript indexing.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 10 — Recorded Classes
  // ----------------------------------------------------
  const recordedClassesContent = (
    <div className="space-y-4">
      <VFCard title="On-Demand Recorded Lecture Library for Students">
        <p className="text-xs text-muted-foreground mb-3">Browse past recorded lectures for revision and missed class playback.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 11 — Online Class History
  // ----------------------------------------------------
  const historyContent = (
    <div className="space-y-4">
      <VFCard title="Completed Virtual Class Logs & Session Archives">
        <p className="text-xs text-muted-foreground mb-3">Historical archive of all online classes held during the academic year.</p>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 12 — Online Class Reports
  // ----------------------------------------------------
  const reportsContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <VFStatCard title="Total Classes Held" value="340 Sessions" icon={<Laptop className="h-5 w-5" />} trend="up" trendLabel="100% Completed" accentColor="primary" />
        <VFStatCard title="Total Live Hours" value="480 Hours" icon={<Clock className="h-5 w-5" />} trend="up" trendLabel="Streamed Live" accentColor="emerald" />
        <VFStatCard title="Bandwidth Quality" value="99.4% HD" icon={<CheckCircle2 className="h-5 w-5" />} trend="neutral" trendLabel="Low Latency" accentColor="purple" />
        <VFStatCard title="Recording Storage" value="240 GB" icon={<Download className="h-5 w-5" />} trend="neutral" trendLabel="Cloud Storage" accentColor="amber" />
      </div>
    </div>
  );

  // ----------------------------------------------------
  // SUBMODULE 13 — Online Class Settings
  // ----------------------------------------------------
  const settingsContent = (
    <div className="space-y-4">
      <VFCard title="Global Online Class & WebRTC Stream Settings">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-2">
          <VFSelect label="Default Video Quality" options={[{ label: '1080p Full HD', value: '1080p' }, { label: '720p HD (Bandwidth Saver)', value: '720p' }]} />
          <VFSelect label="Auto-Record All Live Classes" options={[{ label: 'Enabled (Auto Cloud Save)', value: 'true' }, { label: 'Manual Host Toggle', value: 'false' }]} />
        </div>
      </VFCard>
    </div>
  );

  // ----------------------------------------------------
  // ALL 13 SUBMODULE TABS MAPPED
  // ----------------------------------------------------
  const submoduleTabs = [
    { id: 'dashboard', label: isHindi ? 'ऑनलाइन क्लास डैशबोर्ड' : 'Online Class Dashboard', icon: <BarChart3 className="h-3.5 w-3.5" />, content: dashboardContent },
    { id: 'schedule', label: isHindi ? 'क्लास टाइमटेबल' : 'Class Schedule', icon: <Calendar className="h-3.5 w-3.5" />, content: scheduleContent },
    { id: 'create-class', label: isHindi ? 'ऑनलाइन क्लास बनाएं' : 'Create Online Class', icon: <Plus className="h-3.5 w-3.5" />, content: createClassContent },
    { id: 'live-classes', label: isHindi ? 'लाइव क्लासेज' : 'Live Classes', icon: <Video className="h-3.5 w-3.5 text-rose-500" />, content: liveClassesContent },
    { id: 'meeting-management', label: isHindi ? 'मीटिंग मैनेजमेंट' : 'Meeting Management', icon: <Users className="h-3.5 w-3.5" />, content: meetingManagementContent },
    { id: 'attendance', label: isHindi ? 'ऑनलाइन अटेंडेंस' : 'Online Attendance', icon: <CheckCircle2 className="h-3.5 w-3.5" />, content: attendanceContent },
    { id: 'class-materials', label: isHindi ? 'क्लास स्टडी मटेरियल' : 'Class Materials', icon: <Download className="h-3.5 w-3.5" />, content: classMaterialsContent },
    { id: 'content-sharing', label: isHindi ? 'स्क्रीन / कंटेंट शेयरिंग' : 'Screen/Content Sharing', icon: <Share2 className="h-3.5 w-3.5" />, content: contentSharingContent },
    { id: 'recordings', label: isHindi ? 'रिकॉर्डिंग्स' : 'Recordings', icon: <PlayCircle className="h-3.5 w-3.5" />, content: recordingsContent },
    { id: 'recorded-classes', label: isHindi ? 'रिकॉर्डेड क्लासेज' : 'Recorded Classes', icon: <PlayCircle className="h-3.5 w-3.5" />, content: recordedClassesContent },
    { id: 'history', label: isHindi ? 'ऑनलाइन क्लास हिस्ट्री' : 'Online Class History', icon: <History className="h-3.5 w-3.5" />, content: historyContent },
    { id: 'reports', label: isHindi ? 'ऑनलाइन क्लास रिपोर्ट्स' : 'Online Class Reports', icon: <Download className="h-3.5 w-3.5" />, content: reportsContent },
    { id: 'settings', label: isHindi ? 'ऑनलाइन क्लास सेटिंग्स' : 'Online Class Settings', icon: <SlidersHorizontal className="h-3.5 w-3.5" />, content: settingsContent },
  ];

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* 1. Header Toolbar Box */}
      <VFPageToolbar>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <Video className="h-4 w-4" />
          </div>
          <span className="text-base font-extrabold text-foreground tracking-tight">
            {t('nav.lms')}
          </span>
          <VFBadge variant="success" className="text-[10px] font-bold font-mono">
            WebRTC Live
          </VFBadge>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <VFButton
            size="sm"
            className="h-9 px-3.5 text-xs font-bold shadow-xs"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setActiveSubmodule('create-class')}
          >
            {isHindi ? 'क्लास शुरू करें' : 'Launch Class'}
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
