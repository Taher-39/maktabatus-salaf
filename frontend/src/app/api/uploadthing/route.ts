import { createUploadthing, type UploadThingRequest } from "uploadthing/server";

const f = createUploadthing();

// NOTE: You MUST configure `appId`/middleware provider for uploadthing in your UploadThing dashboard.
// This repo's backend doesn't yet include uploadthing middleware; we implement a minimal route here.

export const pdfUpload = f({
  pdf: {
    maxFileSize: "100MB",
    maxFileCount: 1,
    // type filtering is typically done at client; keep it permissive here.
  },
});

export const { handlers } = pdfUpload;

export const OPTIONS = () => new Response(null, { status: 204 });





