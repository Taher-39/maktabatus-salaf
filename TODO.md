# TODO

## Upload PDF feature (previewPdf)
- [x] Implement UploadThing client-side PDF upload in `frontend/src/app/admin/books/page.tsx`, store returned `previewPdfUrl`, and submit only `previewPdfUrl`.
- [x] Adjust admin UI state: show upload progress, clear/replace PDF selection safely.

- [x] (Optional) Remove `previewPdf` multipart handling from backend book routes (`backend/src/modules/book/book.routes.ts`) for correctness.
- [ ] Run `npm run lint` + `npm run build` in both `frontend` and `backend`.
- [ ] Smoke-test create/edit book with PDF.



