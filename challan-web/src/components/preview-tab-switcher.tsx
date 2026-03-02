import { cn } from "@/lib/utils";
import { Eye, FileText } from "lucide-react";

interface PreviewTabSwitcherProps {
  mobilePreviewTab: "form" | "preview";
  setMobilePreviewTab: (tab: "form" | "preview") => void;
}

const PreviewTabSwitcher = ({
  mobilePreviewTab,
  setMobilePreviewTab,
}: PreviewTabSwitcherProps) => {
  return (
    <div className="lg:hidden">
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl max-w-xs">
        <button
          onClick={() => setMobilePreviewTab("form")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
            mobilePreviewTab === "form"
              ? "bg-white text-dark-blue shadow-sm"
              : "text-neutral-500 hover:text-neutral-700",
          )}
        >
          <FileText className="w-3.5 h-3.5" /> Form
        </button>
        <button
          onClick={() => setMobilePreviewTab("preview")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
            mobilePreviewTab === "preview"
              ? "bg-white text-dark-blue shadow-sm"
              : "text-neutral-500 hover:text-neutral-700",
          )}
        >
          <Eye className="w-3.5 h-3.5" /> Preview
        </button>
      </div>
    </div>
  );
};

export default PreviewTabSwitcher;
