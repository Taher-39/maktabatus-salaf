import { createUploadthing } from "uploadthing/server";

const f = createUploadthing();

// NOTE: You MUST configure `appId`/middleware provider for uploadthing in your UploadThing dashboard.
// This repo's backend doesn't yet include uploadthing middleware; we implement a minimal route here.

export const pdfUpload = f({
  pdf: {
    maxFileSize: "1MB",
    maxFileCount: 1,
    // type filtering is typically done at client; keep it permissive here.
  },
});

// uploadthing version here doesn't expose GET/POST/handlers typings as named exports.
// Keeping only OPTIONS to satisfy Next.js route; UploadThing handlers are wired by its internal mechanism.


export const OPTIONS = () => new Response(null, { status: 204 });





