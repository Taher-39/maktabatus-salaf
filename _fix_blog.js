const fs = require('fs');
const path = 'g:/Salaf_ECom/frontend/src/app/admin/blogs/create/page.tsx';
let c = fs.readFileSync(path, 'utf8');

// Add state and image vars after error state
c = c.replace(
  'const [error, setError] = useState("");',
  'const [error, setError] = useState("");\n' +
  '  const [imagePreview, setImagePreview] = useState<string | null>(null);\n' +
  '  const fileInputRef = useRef<HTMLInputElement>(null);\n' +
  '\n' +
  '  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n' +
  '    const file = e.target.files?.[0];\n' +
  '    if (file) {\n' +
  '      const reader = new FileReader();\n' +
  '      reader.onloadend = () => setImagePreview(reader.result as string);\n' +
  '      reader.readAsDataURL(file);\n' +
  '    } else {\n' +
  '      setImagePreview(null);\n' +
  '    }\n' +
  '  };'
);

// Update handleSubmit to use FormData
c = c.replace(
  'const payload = { title: title.trim(), excerpt: excerpt.trim(), content, category: category.trim() };\n      // For simplicity, create as published (admin wants it visible)\n      await createBlog(payload);',
  'const imageFile = fileInputRef.current?.files?.[0] || null;\n' +
  '      const payload = { title: title.trim(), excerpt: excerpt.trim(), content, category: category.trim() };\n' +
  '      // For simplicity, create as published (admin wants it visible)\n' +
  '      await createBlog(payload, imageFile);'
);

// Insert image upload UI before Content section
c = c.replace(
  '          </div>\n\n          {/* Content */}',
  '          </div>\n\n          {/* Blog image */}\n          <div>\n            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">\u09AC\u09CD\u09B2\u09CB\u0997 \u099B\u09AC\u09BF</label>\n            <input\n              ref={fileInputRef}\n              type="file"\n              accept="image/jpeg,image/jpg,image/png,image/webp"\n              onChange={handleImageChange}\n              className="hidden"\n            />\n            <button\n              type="button"\n              onClick={() => fileInputRef.current?.click()}\n              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"\n            >\n              <FiImage size={16} />\n              {imagePreview ? "\u099B\u09AC\u09BF \u09AC\u09A6\u09B2\u09C1\u09A8" : "\u099B\u09AC\u09BF \u09AF\u09C1\u0995\u09CD\u09A4 \u0995\u09B0\u09C1\u09A8"}\n            </button>\n            {imagePreview && (\n              <div className="mt-3">\n                <img\n                  src={imagePreview}\n                  alt="Preview"\n                  className="h-32 w-auto rounded-lg border border-gray-200 object-cover"\n                />\n              </div>\n            )}\n          </div>\n\n          {/* Content */}'
);

fs.writeFileSync(path, c, 'utf8');
console.log('Fixed:', path);
