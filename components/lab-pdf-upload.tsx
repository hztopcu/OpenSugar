"use client";

import { useState, useRef } from "react";
import { parseAndSaveLabPdf } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, Loader2, FileText } from "lucide-react";

const MAX_SIZE_MB = 10;

export function LabPdfUpload() {
  const { t } = useLanguage();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]');
    const file = fileInput?.files?.[0];
    if (!file) {
      toast.error(t("lab.uploadErrorNoFile"));
      return;
    }
    if (file.type !== "application/pdf") {
      toast.error(t("lab.uploadErrorNotPdf"));
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(t("lab.uploadErrorTooBig"));
      return;
    }

    setPending(true);
    const formData = new FormData();
    formData.set("file", file);
    try {
      const result = await parseAndSaveLabPdf({}, formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(
        result.extractedCount
          ? t("lab.uploadSuccessCount").replace("{{count}}", String(result.extractedCount))
          : t("lab.uploadSuccess")
      );
      setFileName(null);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch (err) {
      console.error("LabPdfUpload:", err);
      toast.error(t("lab.uploadError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <label
            htmlFor="lab-pdf-file"
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
          >
            <FileText className="h-5 w-5 shrink-0" strokeWidth={1.5} />
            <input
              ref={inputRef}
              id="lab-pdf-file"
              name="file"
              type="file"
              accept=".pdf,application/pdf"
              className="sr-only"
              disabled={pending}
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
            <span className="truncate">
              {fileName ?? t("lab.uploadChooseFile")}
            </span>
          </label>
          <p className="text-xs text-muted-foreground">
            {t("lab.uploadHint")}
          </p>
        </div>
        <Button
          type="submit"
          disabled={pending || !fileName}
          className="shrink-0 gap-2"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {t("lab.uploading")}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              {t("lab.uploadLabReport")}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
