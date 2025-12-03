import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  Folder,
  GraduationCap,
  Sparkles,
  User,
  Share2Icon,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsFOrm";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api";

function ResumeBuilder() {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: Folder },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  // safeClone: prefer structuredClone, fallback to JSON deep clone
  function safeClone(obj) {
    try {
      // eslint-disable-next-line no-undef
      if (typeof structuredClone === "function") return structuredClone(obj);
    } catch (e) {
      // ignore
    }
    return JSON.parse(JSON.stringify(obj || {}));
  }

  // -------------------------
  // Mapping helpers
  // -------------------------

  // Convert server resume shape -> frontend shape
  function normalizeFromServer(resume) {
    if (!resume) return {
      _id: "",
      title: "",
      personal_info: {},
      professional_summary: "",
      experience: [],
      education: [],
      project: [],
      skills: [],
      template: "classic",
      accent_color: "#3B82F6",
      public: false,
    };

    return {
      _id: resume._id || resume.id || "",
      title: resume.title || "Untiled Resume",
      public: typeof resume.public === "boolean" ? resume.public : false,
      template: resume.template || "classic",
      accent_color: resume.accent_color || "#3B82F6",
      professional_summary: resume.professional_summary || "",
      skills: Array.isArray(resume.skills) ? resume.skills : (resume.skills ? [resume.skills] : []),
      // Map personalInfo -> personal_info (server -> frontend)
      personal_info: {
        image: resume.personalInfo?.image || resume.personal_info?.image || "",
        full_name: resume.personalInfo?.full_name || resume.personal_info?.full_name || "",
        profession: resume.personalInfo?.profession || resume.personal_info?.profession || "",
        email: resume.personalInfo?.email || resume.personal_info?.email || "",
        phone: resume.personalInfo?.phone || resume.personal_info?.phone || "",
        location: resume.personalInfo?.location || resume.personal_info?.location || "",
        linkedin: resume.personalInfo?.linkedin || resume.personal_info?.linkedin || "",
        website: resume.personalInfo?.website || resume.personal_info?.website || "",
      },
      // Map projects -> project (server -> frontend)
      project: Array.isArray(resume.projects) ? resume.projects : (resume.project || []),
      experience: Array.isArray(resume.experience) ? resume.experience : (resume.experience || []),
      education: Array.isArray(resume.education) ? resume.education : (resume.education || []),
    };
  }

  // Convert frontend shape -> server shape (for JSON part)
  function prepareForServer(frontendResume) {
    if (!frontendResume) return {};
    const draft = { ...frontendResume };

    const personalInfo = { ...(draft.personal_info || {}) };
    // Remove file object from JSON payload (file will be attached separately in FormData)
    if (personalInfo.image && typeof personalInfo.image === "object") {
      delete personalInfo.image;
    }

    const serverShape = {
      _id: draft._id,
      title: draft.title,
      public: draft.public,
      template: draft.template,
      accent_color: draft.accent_color,
      professional_summary: draft.professional_summary,
      skills: Array.isArray(draft.skills) ? draft.skills : [],
      personalInfo, // mapped to server's expected key
      // Map frontend project -> server projects
      projects: Array.isArray(draft.project) ? draft.project : [],
      experience: Array.isArray(draft.experience) ? draft.experience : [],
      education: Array.isArray(draft.education) ? draft.education : [],
    };

    return serverShape;
  }

  // -------------------------
  // API interactions
  // -------------------------

  const loadExistingResume = async (id) => {
    if (!id) return;
    try {
      const res = await api.get("/api/resumes/get/" + id, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = res?.data;
      if (data?.resume) {
        const normalized = normalizeFromServer(data.resume);
        setResumeData((prev) => ({ ...prev, ...normalized }));
        if (normalized.title) document.title = normalized.title;
      } else {
        console.warn("No resume returned from server");
      }
    } catch (error) {
      console.error("loadExistingResume error:", error);
      toast.error("Failed to load resume");
    }
  };

  useEffect(() => {
    if (resumeId) {
      loadExistingResume(resumeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  // Save resume (full update)
  const saveResume = async () => {
    try {
      // Clone state
      const cloned = safeClone(resumeData);

      // Map to server shape
      const serverPayload = prepareForServer(cloned);

      const formData = new FormData();
      if (resumeId) formData.append("resumeId", resumeId);

      formData.append("resumeData", JSON.stringify(serverPayload));

      if (removeBackground) formData.append("removeBackground", "yes");

      // Attach image file if user uploaded a File object
      const img = resumeData.personal_info?.image;
      if (img && typeof img === "object" && img instanceof File) {
        formData.append("image", img);
      }

      const res = await api.put("/api/resumes/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = res?.data;
      if (data?.resume) {
        const normalized = normalizeFromServer(data.resume);
        setResumeData((prev) => ({ ...prev, ...normalized }));
        toast.success(data.message || "Saved successfully");
      } else {
        toast.success(data.message || "Saved");
      }
    } catch (error) {
      console.error("Error saving resume", error);
      toast.error("Failed to save resume");
      throw error; // rethrow so toast.promise can catch if used
    }
  };

  // Toggle visibility (quick update)
  const changeResumeVisibility = async () => {
    try {
      const newPublic = !resumeData.public;
      const minimalPayload = { public: newPublic };

      const formData = new FormData();
      if (resumeId) formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(minimalPayload));

      const res = await api.put("/api/resumes/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      setResumeData((prev) => ({ ...prev, public: newPublic }));
      toast.success(res?.data?.message || "Visibility updated");
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast.error("Failed to update visibility");
    }
  };

  // Share and print
  const handleShare = () => {
    const frontendUrl = window.location.href.split("/app")[0];
    const resumeUrl = `${frontendUrl}/view/${resumeData._id}`;
    if (navigator.share) {
      navigator
        .share({
          title: "My Resume",
          text: "Check out my resume!",
          url: resumeUrl,
        })
        .catch((err) => {
          console.error("Share failed:", err);
          alert("Share failed. Copy link: " + resumeUrl);
        });
    } else {
      alert("Share feature is not supported in your browser. Copy the link: " + resumeUrl);
    }
  };

  const downloadResume = () => {
    window.print();
  };

  // -------------------------
  // Render
  // -------------------------

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to={"/app"}
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>
      <div className="max-w-7-xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel - Form */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              {/* Progress Bar using activeSectionIndex */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000"
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }}
              />
              {/* Section Navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-graay-300 py-1">
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) => setResumeData((prev) => ({ ...prev, template }))}
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) => setResumeData((prev) => ({ ...prev, accent_color: color }))}
                  />
                </div>
                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() => setActiveSectionIndex((prev) => prev - 1)}
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      disabled={activeSectionIndex === 0}
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </button>
                  )}
                  <button
                    onClick={() => setActiveSectionIndex((prev) => prev + 1)}
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                      activeSectionIndex === sections.length - 1 && "opacity-50"
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="space y-6">
                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, personal_info: data }))}
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, professional_summary: data }))}
                    setResumeData={setResumeData}
                  />
                )}
                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, experience: data }))}
                    setResumeData={setResumeData}
                  />
                )}
                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, education: data }))}
                    setResumeData={setResumeData}
                  />
                )}
                {activeSection.id === "projects" && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, project: data }))}
                    setResumeData={setResumeData}
                  />
                )}
                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, skills: data }))}
                    setResumeData={setResumeData}
                  />
                )}
              </div>

              <button
                onClick={() =>
                  toast.promise(
                    saveResume(),
                    {
                      loading: "Saving...",
                      success: "Saved",
                      error: "Error saving",
                    },
                    { success: { duration: 2000 } }
                  )
                }
                className="bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Right Panel - Resume Preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <div className="absolute botttom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors"
                  >
                    <Share2Icon className="size-4" />
                    Share
                  </button>
                )}
                <button
                  onClick={changeResumeVisibility}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-200 text-purple-600 rounded-lg ring-purple-300 hover:ring transition-colors"
                >
                  {resumeData.public ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
                  {resumeData.public ? "Public" : "Private"}
                </button>
                <button
                  onClick={downloadResume}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors"
                >
                  <DownloadIcon className="size-4" />
                  Download
                </button>
              </div>
            </div>

            {/* Preview */}
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;
