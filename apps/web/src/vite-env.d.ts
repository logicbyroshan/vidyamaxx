/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_SUBSYSTEM_TRANSPORT_URL?: string;
  readonly VITE_SUBSYSTEM_ELIBRARY_URL?: string;
  readonly VITE_SUBSYSTEM_ECLASS_URL?: string;
  readonly VITE_SUBSYSTEM_HOSTEL_URL?: string;
  readonly VITE_SUBSYSTEM_HR_URL?: string;
  readonly VITE_SUBSYSTEM_DESIGNLAB_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
