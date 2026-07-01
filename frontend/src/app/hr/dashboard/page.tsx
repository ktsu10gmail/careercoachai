"use client";

import { Fragment, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronUpIcon, PencilIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { GuideLink } from "@/components/GuideLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  apiFetch,
  type Application,
  type ClientCompany,
  type Interview,
  type Job,
  type OrganizationType,
  type User,
} from "@/lib/api";
import {
  clearToken,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage, formatApplicationScore, formatScore } from "@/lib/format";
import { cn } from "@/lib/utils";

type ApplicationStage =
  | "all"
  | "new"
  | "prequalified"
  | "scheduled"
  | "hmDecision"
  | "offerPending"
  | "onHold"
  | "hired"
  | "rejected";

const applicationStages: Array<{
  value: ApplicationStage;
  label: string;
  description: string;
}> = [
  { value: "all", label: "All", description: "Every application" },
  { value: "new", label: "New", description: "Needs HR review" },
  { value: "prequalified", label: "Qualified", description: "Ready to schedule" },
  { value: "scheduled", label: "Scheduled", description: "Awaiting HM feedback" },
  { value: "hmDecision", label: "HM Decision", description: "Manager submitted" },
  { value: "offerPending", label: "Offer", description: "HR preparing offer" },
  { value: "onHold", label: "Hold", description: "Needs HR follow-up" },
  { value: "hired", label: "Hired", description: "Final hire decision" },
  { value: "rejected", label: "Rejected", description: "Final reject decision" },
];

const APPLICATIONS_PER_PAGE = 10;
const OFFICE_HOUR_TIME_SLOTS = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
];

export default function HrDashboardPage() {
  const [token, setToken] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("all");
  const [statusFilter, setStatusFilter] = useState<ApplicationStage>("new");
  const [applicationPage, setApplicationPage] = useState(1);
  const [applications, setApplications] = useState<Application[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [organizationType, setOrganizationType] =
    useState<OrganizationType>("Employer");
  const [clientCompanies, setClientCompanies] = useState<ClientCompany[]>([]);
  const [recruiters, setRecruiters] = useState<User[]>([]);
  const [scheduleDrafts, setScheduleDrafts] = useState<
    Record<number, { managerId: string; scheduleTime: string }>
  >({});
  const [finalDecisionDrafts, setFinalDecisionDrafts] = useState<
    Record<number, { comment: string }>
  >({});
  const [message, setMessage] = useState("");
  const [applicationMessage, setApplicationMessage] = useState("");
  const [busyAction, setBusyAction] = useState("");
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showEditJob, setShowEditJob] = useState(false);

  useEffect(() => {
    async function init() {
      const saved = readToken(EMPLOYER_TOKEN_KEY);
      if (!saved) {
        window.location.href = "/employer/login";
        return;
      }
      try {
        const me = await getCurrentUser(saved);
        const roles = me.roles?.length ? me.roles : [me.role];
        if (!roles.includes("HR") && !roles.includes("Recruiter")) {
          setAuthMessage("This page requires an HR or recruiter login.");
          return;
        }
        setOrganizationType(me.organization_type || "Employer");
        saveToken(EMPLOYER_TOKEN_KEY, saved);
        setToken(saved);
        setAuthMessage(`Signed in as ${me.email}`);
      } catch {
        clearToken(EMPLOYER_TOKEN_KEY);
        window.location.href = "/employer/login";
      }
    }
    void init();
  }, []);

  useEffect(() => {
    if (token) {
      void loadJobs();
      void loadHiringManagers();
      if (organizationType === "Recruiting_Agency") {
        void loadAgencyResources();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, organizationType]);

  async function loadJobs(preferredJobId = Number(selectedJobId)) {
    try {
      const data = await apiFetch<Job[]>("/hr/jobs", { token });
      setJobs(data);
      const preferredJob = data.find((job) => job.id === preferredJobId);
      if (preferredJob) {
        setSelectedJobId(String(preferredJob.id));
        await loadApplications(preferredJob.id);
      } else {
        await loadApplications();
      }
      if (!data.length) {
        setApplicationMessage("No jobs yet. Create a job to start receiving applications.");
      }
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }

  async function loadHiringManagers() {
    try {
      const data = await apiFetch<User[]>("/hr/hiring-managers", { token });
      setManagers(data);
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }

  async function loadAgencyResources() {
    try {
      const [clientsData, recruitersData] = await Promise.all([
        apiFetch<ClientCompany[]>("/client-companies", { token }),
        apiFetch<User[]>("/recruiters", { token }),
      ]);
      setClientCompanies(clientsData);
      setRecruiters(recruitersData);
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }

  async function createJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const job = await apiFetch<Job>("/hr/jobs", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: String(form.get("title") || ""),
          position: String(form.get("position") || ""),
          description: String(form.get("description") || ""),
          salary_range: String(form.get("salary") || "") || null,
          department: String(form.get("department") || "") || null,
          employment_type: String(form.get("employment_type") || "") || null,
          work_mode: String(form.get("work_mode") || "") || null,
          location: String(form.get("location") || "") || null,
          job_level: String(form.get("job_level") || "") || null,
          number_openings: Number(form.get("number_openings") || 1) || 1,
          required_skills: String(form.get("required_skills") || "") || null,
          target_start_date: String(form.get("target_start_date") || "") || null,
          application_deadline: String(form.get("application_deadline") || "") || null,
          client_company_id:
            organizationType === "Recruiting_Agency"
              ? Number(form.get("client_company_id") || 0) || null
              : null,
          assigned_recruiter_id:
            organizationType === "Recruiting_Agency"
              ? Number(form.get("assigned_recruiter_id") || 0) || null
              : null,
        }),
      });
      setMessage(
        `Job "${job.title}" was created. Apply URL: /apply/${job.job_url}. Company board: /${job.company_slug || "company"}.`,
      );
      setSelectedJobId(String(job.id));
      event.currentTarget.reset();
      setShowCreateJob(false);
      await loadJobs(job.id);
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }

  function jobPayloadFromForm(form: FormData) {
    return {
      title: String(form.get("title") || ""),
      position: String(form.get("position") || ""),
      description: String(form.get("description") || ""),
      salary_range: String(form.get("salary") || "") || null,
      department: String(form.get("department") || "") || null,
      employment_type: String(form.get("employment_type") || "") || null,
      work_mode: String(form.get("work_mode") || "") || null,
      location: String(form.get("location") || "") || null,
      job_level: String(form.get("job_level") || "") || null,
      number_openings: Number(form.get("number_openings") || 1) || 1,
      required_skills: String(form.get("required_skills") || "") || null,
      target_start_date: String(form.get("target_start_date") || "") || null,
      application_deadline: String(form.get("application_deadline") || "") || null,
      status: String(form.get("status") || "Active"),
      client_company_id:
        organizationType === "Recruiting_Agency"
          ? Number(form.get("client_company_id") || 0) || null
          : null,
      assigned_recruiter_id:
        organizationType === "Recruiting_Agency"
          ? Number(form.get("assigned_recruiter_id") || 0) || null
          : null,
    };
  }

  async function updateJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedJob = jobs.find((job) => String(job.id) === selectedJobId);
    if (!selectedJob) {
      setMessage("Select a job before editing.");
      return;
    }
    const form = new FormData(event.currentTarget);
    try {
      const job = await apiFetch<Job>(`/hr/jobs/${selectedJob.id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(jobPayloadFromForm(form)),
      });
      setMessage(`Job "${job.title}" was updated.`);
      toast.success(`Job "${job.title}" was updated.`);
      await loadJobs(job.id);
      await loadApplications(job.id);
      setSelectedJobId(String(job.id));
      setShowEditJob(false);
    } catch (error) {
      const message = detailMessage(error);
      setMessage(message);
      toast.error(message);
    }
  }

  async function loadApplications(jobIdValue?: number) {
    try {
      const effectiveJobId =
        jobIdValue ||
        (selectedJobId && selectedJobId !== "all" ? Number(selectedJobId) : 0);
      const data = await apiFetch<Application[]>(
        effectiveJobId
          ? `/hr/jobs/${effectiveJobId}/applications`
          : "/hr/applications",
        { token },
      );
      setApplications(data);
      setApplicationMessage(data.length ? "" : "No applications yet.");
    } catch (error) {
      setApplicationMessage(detailMessage(error));
    }
  }

  async function prequalify(applicationId: number) {
    setBusyAction(`prequalify-${applicationId}`);
    setApplicationMessage(`Pre-qualifying application #${applicationId}...`);
    try {
      await apiFetch<Application>(
        `/hr/applications/${applicationId}/prequalify`,
        { method: "POST", token },
      );
      setApplicationMessage(`Application #${applicationId} was qualified.`);
      await loadApplications();
    } catch (error) {
      setApplicationMessage(detailMessage(error));
    } finally {
      setBusyAction("");
    }
  }

  async function rejectApplication(applicationId: number) {
    setBusyAction(`reject-${applicationId}`);
    setApplicationMessage(`Rejecting application #${applicationId}...`);
    try {
      const data = await apiFetch<Application>(
        `/hr/applications/${applicationId}/reject`,
        { method: "POST", token },
      );
      const message = `Application #${applicationId} moved to ${data.status}.`;
      setApplicationMessage(message);
      toast.success(message);
      await loadApplications();
    } catch (error) {
      const message = detailMessage(error);
      setApplicationMessage(message);
      toast.error(message);
    } finally {
      setBusyAction("");
    }
  }

  function updateScheduleDraft(
    applicationId: number,
    patch: Partial<{ managerId: string; scheduleTime: string }>,
  ) {
    setScheduleDrafts((current) => ({
      ...current,
      [applicationId]: {
        managerId:
          current[applicationId]?.managerId ||
          (managers.length === 1 ? String(managers[0].id) : ""),
        scheduleTime: current[applicationId]?.scheduleTime || "",
        ...patch,
      },
    }));
  }

  async function schedule(applicationId: number) {
    const draft = scheduleDrafts[applicationId];
    const application = applications.find((item) => item.id === applicationId);
    const scheduleTime =
      draft?.scheduleTime || toDatetimeLocalValue(application?.scheduled_time);
    const fallbackManagerId = managers.length === 1 ? String(managers[0].id) : "";
    const existingManagerId = application?.scheduled_hiring_manager_id
      ? String(application.scheduled_hiring_manager_id)
      : "";
    const managerId = Number(draft?.managerId || existingManagerId || fallbackManagerId);
    if (!managerId) {
      setApplicationMessage(`Select a hiring manager for application #${applicationId}.`);
      return;
    }
    if (!scheduleTime) {
      const message = `Select an interview date and time for application #${applicationId}.`;
      setApplicationMessage(message);
      toast.error(message);
      return;
    }
    setBusyAction(`schedule-${applicationId}`);
    setApplicationMessage(`Scheduling interview for application #${applicationId}...`);
    try {
      const data = await apiFetch<Interview>(
        `/hr/applications/${applicationId}/schedule`,
        {
          method: "POST",
          token,
          body: JSON.stringify({
            application_id: applicationId,
            hiring_manager_id: managerId,
            schedule_time: scheduleTime,
          }),
        },
      );
      const managerName =
        managers.find((manager) => manager.id === managerId)?.name ||
        `manager #${managerId}`;
      const scheduledFor = data.schedule_time
        ? new Date(data.schedule_time).toLocaleString()
        : "a time to be confirmed";
      const successMessage = `Interview for application #${applicationId} was scheduled with ${managerName} for ${scheduledFor}.`;
      setApplicationMessage(successMessage);
      toast.success(successMessage);
      await loadApplications();
    } catch (error) {
      const message = detailMessage(error);
      setApplicationMessage(message);
      toast.error(message);
    } finally {
      setBusyAction("");
    }
  }

  function updateFinalDecisionDraft(applicationId: number, comment: string) {
    setFinalDecisionDrafts((current) => ({
      ...current,
      [applicationId]: { comment },
    }));
  }

  async function setHrFinalDecision(
    applicationId: number,
    status: "Offer pending" | "On hold" | "Hired" | "Rejected",
  ) {
    const comment = finalDecisionDrafts[applicationId]?.comment || "";
    setBusyAction(`final-${applicationId}-${status}`);
    setApplicationMessage(`Recording HR decision for application #${applicationId}...`);
    try {
      const data = await apiFetch<Application>(
        `/hr/applications/${applicationId}/final-decision`,
        {
          method: "POST",
          token,
          body: JSON.stringify({
            status,
            comment: comment || null,
          }),
        },
      );
      const message = `Application #${applicationId} moved to ${data.status}.`;
      setApplicationMessage(message);
      toast.success(message);
      await loadApplications();
    } catch (error) {
      const message = detailMessage(error);
      setApplicationMessage(message);
      toast.error(message);
    } finally {
      setBusyAction("");
    }
  }

  const selectedJobLabel =
    selectedJobId !== "all"
      ? formatJobOptionLabel(
          jobs.find((job) => String(job.id) === selectedJobId),
          "Selected job",
        )
      : "All jobs";
  const selectedJob = jobs.find((job) => String(job.id) === selectedJobId);
  const filteredApplications = applications.filter(
    (application) =>
      statusFilter === "all" || applicationMatchesStage(application, statusFilter),
  );
  const applicationPageCount = Math.max(
    1,
    Math.ceil(filteredApplications.length / APPLICATIONS_PER_PAGE),
  );
  const currentApplicationPage = Math.min(applicationPage, applicationPageCount);
  const paginatedApplications = filteredApplications.slice(
    (currentApplicationPage - 1) * APPLICATIONS_PER_PAGE,
    currentApplicationPage * APPLICATIONS_PER_PAGE,
  );
  const stageCounts = Object.fromEntries(
    applicationStages.map((stage) => [
      stage.value,
      stage.value === "all"
        ? applications.length
        : applications.filter(
            (application) => applicationMatchesStage(application, stage.value),
          ).length,
    ]),
  ) as Record<ApplicationStage, number>;

  return (
    <AppShell
      eyebrow="HR dashboard"
      title="Create jobs and manage the application pipeline."
      description={authMessage || "Checking HR login..."}
      actions={<GuideLink href="/guides/hr" />}
      contentClassName="max-w-[1800px]"
    >
      <div className="grid gap-5">
        <Panel
          title="Create job"
          description={
            showCreateJob
              ? organizationType === "Recruiting_Agency"
                ? "Select the client company, then enter the job details to generate assessment questions."
                : "Enter the job details and source description to generate assessment questions."
              : "Open this when you need to publish a new role."
          }
          action={
            <Button
              aria-expanded={showCreateJob}
              onClick={() => setShowCreateJob((current) => !current)}
              type="button"
              variant="outline"
            >
              {showCreateJob ? (
                <>
                  <ChevronUpIcon className="size-4" />
                  Hide
                </>
              ) : (
                <>
                  <PlusIcon className="size-4" />
                  New job
                </>
              )}
            </Button>
          }
        >
          {showCreateJob ? (
            <form className="grid gap-4 lg:grid-cols-2" onSubmit={createJob}>
              {organizationType === "Recruiting_Agency" ? (
                <>
                  <div className="grid gap-2">
                    <Label>Client company</Label>
                    <Select name="client_company_id" required>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientCompanies.map((client) => (
                          <SelectItem key={client.id} value={String(client.id)}>
                            {client.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Assigned recruiter</Label>
                    <Select name="assigned_recruiter_id">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Optional" />
                      </SelectTrigger>
                      <SelectContent>
                        {recruiters.map((recruiter) => (
                          <SelectItem key={recruiter.id} value={String(recruiter.id)}>
                            {recruiter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : null}
              <div className="grid gap-2">
                <Label htmlFor="job-title">Title</Label>
                <Input id="job-title" name="title" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job-position">Position</Label>
                <Input id="job-position" name="position" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job-salary">Salary range</Label>
                <Input id="job-salary" name="salary" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job-department">Department</Label>
                <Input id="job-department" name="department" placeholder="Engineering, Sales, Finance" />
              </div>
              <div className="grid gap-2">
                <Label>Employment type</Label>
                <Select name="employment_type">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Work mode</Label>
                <Select name="work_mode">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On-site">On-site</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job-location">Location</Label>
                <Input id="job-location" name="location" placeholder="New York, NY or Remote" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job-level">Job level</Label>
                <Input id="job-level" name="job_level" placeholder="Entry, Mid, Senior, Lead" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job-openings">Openings</Label>
                <Input id="job-openings" min={1} name="number_openings" type="number" defaultValue={1} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job-target-start">Target start date</Label>
                <Input id="job-target-start" name="target_start_date" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job-application-deadline">Application deadline</Label>
                <Input id="job-application-deadline" name="application_deadline" type="date" />
              </div>
              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="job-required-skills">Required skills</Label>
                <Textarea
                  id="job-required-skills"
                  className="min-h-24"
                  name="required_skills"
                  placeholder="Python, Kubernetes, observability, stakeholder communication"
                />
              </div>
              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="job-description">Description</Label>
                <Textarea
                  id="job-description"
                  className="min-h-36"
                  name="description"
                  required
                />
              </div>
              <Button className="w-fit" type="submit">Create job</Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">
              Job creation is collapsed so the active application queue stays in view.
            </p>
          )}
        </Panel>

        <Panel
          title="Edit selected job"
          description={
            selectedJob
              ? "Update job details, public posting attributes, status, and deadline fields."
              : "Select a specific job in Applications to edit its posting."
          }
          action={
            <Button
              aria-expanded={showEditJob}
              disabled={!selectedJob}
              onClick={() => setShowEditJob((current) => !current)}
              type="button"
              variant="outline"
            >
              {showEditJob ? (
                <>
                  <ChevronUpIcon className="size-4" />
                  Hide
                </>
              ) : (
                <>
                  <PencilIcon className="size-4" />
                  Edit job
                </>
              )}
            </Button>
          }
        >
          {selectedJob && showEditJob ? (
            <form
              className="grid gap-4 lg:grid-cols-2"
              key={selectedJob.id}
              onSubmit={updateJob}
            >
              {organizationType === "Recruiting_Agency" ? (
                <>
                  <div className="grid gap-2">
                    <Label>Client company</Label>
                    <Select
                      defaultValue={
                        selectedJob.client_company_id ? String(selectedJob.client_company_id) : undefined
                      }
                      name="client_company_id"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientCompanies.map((client) => (
                          <SelectItem key={client.id} value={String(client.id)}>
                            {client.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Assigned recruiter</Label>
                    <Select
                      defaultValue={
                        selectedJob.assigned_recruiter_id
                          ? String(selectedJob.assigned_recruiter_id)
                          : undefined
                      }
                      name="assigned_recruiter_id"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Optional" />
                      </SelectTrigger>
                      <SelectContent>
                        {recruiters.map((recruiter) => (
                          <SelectItem key={recruiter.id} value={String(recruiter.id)}>
                            {recruiter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : null}
              <div className="grid gap-2">
                <Label htmlFor="edit-job-title">Title</Label>
                <Input
                  defaultValue={selectedJob.title}
                  id="edit-job-title"
                  name="title"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-job-position">Position</Label>
                <Input
                  defaultValue={selectedJob.position}
                  id="edit-job-position"
                  name="position"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select defaultValue={selectedJob.status} name="status">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-job-salary">Salary range</Label>
                <Input
                  defaultValue={selectedJob.salary_range || ""}
                  id="edit-job-salary"
                  name="salary"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-job-department">Department</Label>
                <Input
                  defaultValue={selectedJob.department || ""}
                  id="edit-job-department"
                  name="department"
                />
              </div>
              <div className="grid gap-2">
                <Label>Employment type</Label>
                <Select defaultValue={selectedJob.employment_type || undefined} name="employment_type">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Work mode</Label>
                <Select defaultValue={selectedJob.work_mode || undefined} name="work_mode">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On-site">On-site</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-job-location">Location</Label>
                <Input
                  defaultValue={selectedJob.location || ""}
                  id="edit-job-location"
                  name="location"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-job-level">Job level</Label>
                <Input
                  defaultValue={selectedJob.job_level || ""}
                  id="edit-job-level"
                  name="job_level"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-job-openings">Openings</Label>
                <Input
                  defaultValue={selectedJob.number_openings || 1}
                  id="edit-job-openings"
                  min={1}
                  name="number_openings"
                  type="number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-job-target-start">Target start date</Label>
                <Input
                  defaultValue={selectedJob.target_start_date || ""}
                  id="edit-job-target-start"
                  name="target_start_date"
                  type="date"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-job-application-deadline">Application deadline</Label>
                <Input
                  defaultValue={selectedJob.application_deadline || ""}
                  id="edit-job-application-deadline"
                  name="application_deadline"
                  type="date"
                />
              </div>
              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="edit-job-required-skills">Required skills</Label>
                <Textarea
                  className="min-h-24"
                  defaultValue={selectedJob.required_skills || ""}
                  id="edit-job-required-skills"
                  name="required_skills"
                />
              </div>
              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="edit-job-description">Description</Label>
                <Textarea
                  className="min-h-36"
                  defaultValue={selectedJob.description}
                  id="edit-job-description"
                  name="description"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-3 lg:col-span-2">
                <Button type="submit">Save job changes</Button>
                <Button
                  onClick={() => setShowEditJob(false)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">
              {selectedJob
                ? "Use Edit job after selecting a specific role in the Applications filter."
                : "Choose a job from the Applications job filter first."}
            </p>
          )}
        </Panel>

        <Panel
          title="Applications"
          description="Filter by status first, then narrow to a job when needed."
        >
          <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <Select
              value={selectedJobId}
              onValueChange={(value) => {
                const nextValue = !value ? "all" : value;
                setSelectedJobId(nextValue);
                setApplicationPage(1);
                void loadApplications(nextValue === "all" ? undefined : Number(nextValue));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{selectedJobLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All jobs</SelectItem>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={String(job.id)}>
                    {formatJobOptionLabel(job)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => void loadJobs()} type="button" variant="outline">
              Refresh jobs
            </Button>
            <Button onClick={() => void loadApplications()} type="button">
              Refresh candidates
            </Button>
          </div>
          <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-9">
            {applicationStages.map((stage) => (
              <Button
                className="h-auto justify-between gap-3 px-3 py-3 text-left"
                key={stage.value}
                onClick={() => {
                  setStatusFilter(stage.value);
                  setApplicationPage(1);
                }}
                type="button"
                variant={statusFilter === stage.value ? "default" : "outline"}
              >
                <span className="min-w-0">
                  <span className="block truncate">{stage.label}</span>
                  <span className="block truncate text-xs font-normal opacity-75">
                    {stage.description}
                  </span>
                </span>
                <Badge
                  variant={statusFilter === stage.value ? "secondary" : "outline"}
                >
                  {stageCounts[stage.value]}
                </Badge>
              </Button>
            ))}
          </div>
          <ApplicationsTable
            applications={paginatedApplications}
            busyAction={busyAction}
            managers={managers}
            scheduleDrafts={scheduleDrafts}
            finalDecisionDrafts={finalDecisionDrafts}
            onPrequalify={prequalify}
            onReject={rejectApplication}
            onDraftChange={updateScheduleDraft}
            onFinalDraftChange={updateFinalDecisionDraft}
            onFinalDecision={setHrFinalDecision}
            onSchedule={schedule}
          />
          <ApplicationsPagination
            currentPage={currentApplicationPage}
            pageCount={applicationPageCount}
            pageSize={APPLICATIONS_PER_PAGE}
            totalItems={filteredApplications.length}
            onPageChange={setApplicationPage}
          />
          <Message>{applicationMessage}</Message>
        </Panel>

        <Message>{message}</Message>
      </div>
    </AppShell>
  );
}

function formatJobOptionLabel(job: Job | undefined, fallback = "Selected job") {
  if (!job) return fallback;
  const clientPrefix = job.client_company_name ? `${job.client_company_name} - ` : "";
  return `${clientPrefix}#${job.id} - ${job.title} (${job.job_url})`;
}

function ApplicationsTable({
  applications,
  busyAction,
  managers,
  scheduleDrafts,
  finalDecisionDrafts,
  onPrequalify,
  onReject,
  onDraftChange,
  onFinalDraftChange,
  onFinalDecision,
  onSchedule,
}: {
  applications: Application[];
  busyAction?: string;
  managers: User[];
  scheduleDrafts: Record<number, { managerId: string; scheduleTime: string }>;
  finalDecisionDrafts: Record<number, { comment: string }>;
  onPrequalify?: (id: number) => void;
  onReject?: (id: number) => void;
  onDraftChange: (
    applicationId: number,
    patch: Partial<{ managerId: string; scheduleTime: string }>,
  ) => void;
  onFinalDraftChange: (applicationId: number, comment: string) => void;
  onFinalDecision: (
    applicationId: number,
    status: "Offer pending" | "On hold" | "Hired" | "Rejected",
  ) => void;
  onSchedule: (id: number) => void;
}) {
  const [expandedNotesId, setExpandedNotesId] = useState<number | null>(null);

  if (!applications.length) {
    return <p className="text-muted-foreground">No applications to show.</p>;
  }

  return (
    <div className="max-h-[72vh] overflow-auto rounded-md border">
      <Table className="min-w-[1520px] table-fixed">
        <colgroup>
          <col className="w-[14%]" />
          <col className="w-[15%]" />
          <col className="w-[6%]" />
          <col className="w-[6%]" />
          <col className="w-[6%]" />
          <col className="w-[10%]" />
          <col className="w-[34%]" />
          <col className="w-[9%]" />
        </colgroup>
        <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Answers</TableHead>
            <TableHead className="whitespace-normal">Stage</TableHead>
            <TableHead>Workflow</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => {
            const stage = getApplicationStage(application);
            const canReject = stage !== "rejected" && stage !== "hired";
            const canSchedule =
              !application.hiring_manager_recommendation &&
              (stage === "prequalified" ||
                stage === "scheduled");
            const hasEvaluationNotes = Boolean(
              application.resume_comment || application.answer_comment,
            );
            const notesId = `evaluation-notes-${application.id}`;
            const notesExpanded = expandedNotesId === application.id;

            return (
              <Fragment key={application.id}>
                <TableRow className="align-top">
                  <TableCell className="whitespace-normal break-words align-top">
                    {hasEvaluationNotes ? (
                      <button
                        aria-controls={notesId}
                        aria-expanded={notesExpanded}
                        className="text-left font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() =>
                          setExpandedNotesId((current) =>
                            current === application.id ? null : application.id,
                          )
                        }
                        type="button"
                      >
                        {application.applicant_name ||
                          application.applicant_email ||
                          "N/A"}
                      </button>
                    ) : (
                      <span className="font-medium">
                        {application.applicant_name ||
                          application.applicant_email ||
                          "N/A"}
                      </span>
                    )}
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {application.applicant_email || ""}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-normal break-words align-top">
                    <span className="font-medium">
                      {application.job_title || "Unknown job"}
                    </span>
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {application.client_company_name ? (
                        <>
                          Client: {application.client_company_name}
                          <br />
                        </>
                      ) : null}
                      Job #{application.job_id}
                      {application.job_position
                        ? ` - ${application.job_position}`
                      : ""}
                    </span>
                  </TableCell>
                  <TableCell className="align-top font-medium">
                    {application.matching_score === null ||
                    application.matching_score === undefined ? (
                      formatApplicationScore(
                        application.matching_score,
                        application.answer_score,
                      )
                    ) : (
                      <Link
                        className="text-cyan-700 underline-offset-4 hover:underline"
                        href={`/employer/applications/${application.id}/analysis`}
                      >
                        {formatApplicationScore(
                          application.matching_score,
                          application.answer_score,
                        )}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell className="align-top">
                    {application.matching_score === null ||
                    application.matching_score === undefined ? (
                      formatScore(application.matching_score)
                    ) : (
                      <Link
                        className="text-cyan-700 underline-offset-4 hover:underline"
                        href={`/employer/applications/${application.id}/analysis`}
                      >
                        {formatScore(application.matching_score)}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell className="align-top">
                    {formatScore(application.answer_score)}
                  </TableCell>
                  <TableCell className="whitespace-normal align-top">
                    <ApplicationStageBadge application={application} />
                  </TableCell>
                  <TableCell className="whitespace-normal align-top">
                    {stage === "hmDecision" || stage === "offerPending" ? (
                      <HrFinalDecisionControls
                        application={application}
                        busyAction={busyAction}
                        comment={finalDecisionDrafts[application.id]?.comment || ""}
                        onCommentChange={onFinalDraftChange}
                        onFinalDecision={onFinalDecision}
                      />
                    ) : canSchedule ? (
                      <SchedulingControls
                        application={application}
                        busyAction={busyAction}
                        managers={managers}
                        scheduleDrafts={scheduleDrafts}
                        onDraftChange={onDraftChange}
                        onSchedule={onSchedule}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {stage === "new"
                          ? "Qualify before scheduling."
                          : "No scheduling action needed."}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="align-top">
                    <ApplicationActionsMenu
                      application={application}
                      busyAction={busyAction}
                      canQualify={stage === "new"}
                      canReject={canReject}
                      onPrequalify={onPrequalify}
                      onReject={onReject}
                    />
                  </TableCell>
                </TableRow>
                {hasEvaluationNotes && notesExpanded ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={8} id={notesId}>
                      <EvaluationNotes application={application} />
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function ApplicationsPagination({
  currentPage,
  pageCount,
  pageSize,
  totalItems,
  onPageChange,
}: {
  currentPage: number;
  pageCount: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  if (!totalItems) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {totalItems} applications
      </p>
      <div className="flex items-center gap-2">
        <Button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          type="button"
          variant="outline"
        >
          Previous
        </Button>
        <span className="min-w-24 text-center text-sm text-muted-foreground">
          Page {currentPage} of {pageCount}
        </span>
        <Button
          disabled={currentPage >= pageCount}
          onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
          type="button"
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function ApplicationActionsMenu({
  application,
  busyAction,
  canQualify,
  canReject,
  onPrequalify,
  onReject,
}: {
  application: Application;
  busyAction?: string;
  canQualify: boolean;
  canReject: boolean;
  onPrequalify?: (id: number) => void;
  onReject?: (id: number) => void;
}) {
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false);
  const qualifying = busyAction === `prequalify-${application.id}`;
  const rejecting = busyAction === `reject-${application.id}`;
  const hasActions = canQualify || canReject;
  const candidateLabel =
    application.applicant_name ||
    application.candidate_name ||
    application.applicant_email ||
    application.candidate_email ||
    `application #${application.id}`;

  return (
    <div className="flex justify-end">
      <Select
        value="actions"
        onValueChange={(value) => {
          if (value === "qualify") onPrequalify?.(application.id);
          if (value === "reject") setConfirmRejectOpen(true);
        }}
      >
        <SelectTrigger
          aria-label={`Choose action for application ${application.id}`}
          className="h-8 w-[118px]"
        >
          <SelectValue>Actions</SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="actions" disabled>
            Actions
          </SelectItem>
          {canQualify ? (
            <SelectItem value="qualify" disabled={qualifying}>
              {qualifying ? "Qualifying..." : "Qualify"}
            </SelectItem>
          ) : null}
          {canReject ? (
            <SelectItem value="reject" disabled={rejecting}>
              {rejecting ? "Rejecting..." : "Reject"}
            </SelectItem>
          ) : null}
          {!hasActions ? (
            <SelectItem value="none" disabled>
              No actions
            </SelectItem>
          ) : null}
        </SelectContent>
      </Select>
      <Dialog open={confirmRejectOpen} onOpenChange={setConfirmRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject this application?</DialogTitle>
            <DialogDescription>
              This will move {candidateLabel} to Rejected and remove it from the
              active hiring queue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setConfirmRejectOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={rejecting}
              onClick={() => {
                setConfirmRejectOpen(false);
                onReject?.(application.id);
              }}
              type="button"
              variant="destructive"
            >
              {rejecting ? "Rejecting..." : "Reject application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function HrFinalDecisionControls({
  application,
  busyAction,
  comment,
  onCommentChange,
  onFinalDecision,
}: {
  application: Application;
  busyAction?: string;
  comment: string;
  onCommentChange: (applicationId: number, comment: string) => void;
  onFinalDecision: (
    applicationId: number,
    status: "Offer pending" | "On hold" | "Hired" | "Rejected",
  ) => void;
}) {
  const stage = getApplicationStage(application);
  const isOfferPending = stage === "offerPending";

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {application.hiring_manager_recommendation ? (
          <Badge variant="secondary">
            HM: {application.hiring_manager_recommendation}
          </Badge>
        ) : null}
        {application.hr_final_decided_at ? (
          <span className="text-xs text-muted-foreground">
            HR: {new Date(application.hr_final_decided_at).toLocaleString()}
          </span>
        ) : null}
      </div>
      <Textarea
        aria-label={`HR final note for application ${application.id}`}
        className="min-h-16"
        onChange={(event) => onCommentChange(application.id, event.target.value)}
        placeholder="HR final notes, offer details, or hold/reject reason..."
        value={comment || application.hr_final_comment || ""}
      />
      <div className="flex flex-wrap gap-2">
        {isOfferPending ? (
          <Button
            disabled={busyAction?.startsWith(`final-${application.id}-`)}
            onClick={() => onFinalDecision(application.id, "Hired")}
            size="sm"
            type="button"
          >
            Mark hired
          </Button>
        ) : (
          <Button
            disabled={busyAction?.startsWith(`final-${application.id}-`)}
            onClick={() => onFinalDecision(application.id, "Offer pending")}
            size="sm"
            type="button"
          >
            Prepare offer
          </Button>
        )}
        <Button
          disabled={busyAction?.startsWith(`final-${application.id}-`)}
          onClick={() => onFinalDecision(application.id, "On hold")}
          size="sm"
          type="button"
          variant="outline"
        >
          Hold
        </Button>
        <Button
          disabled={busyAction?.startsWith(`final-${application.id}-`)}
          onClick={() => onFinalDecision(application.id, "Rejected")}
          size="sm"
          type="button"
          variant="outline"
        >
          Reject
        </Button>
      </div>
    </div>
  );
}

function SchedulingControls({
  application,
  scheduleDrafts,
  busyAction,
  managers,
  onDraftChange,
  onSchedule,
}: {
  application: Application;
  managers: User[];
  scheduleDrafts: Record<number, { managerId: string; scheduleTime: string }>;
  busyAction?: string;
  onDraftChange: (
    applicationId: number,
    patch: Partial<{ managerId: string; scheduleTime: string }>,
  ) => void;
  onSchedule: (id: number) => void;
}) {
  const draft = scheduleDrafts[application.id];
  const managerId =
    draft?.managerId ||
    (application.scheduled_hiring_manager_id
      ? String(application.scheduled_hiring_manager_id)
      : "") ||
    (managers.length === 1 ? String(managers[0].id) : "");
  const managerLabel = managerId
    ? managers.find((manager) => String(manager.id) === managerId)?.name ||
      application.scheduled_hiring_manager_name ||
      "Selected hiring manager"
    : "Select a hiring manager";
  const scheduleTime =
    draft?.scheduleTime || toDatetimeLocalValue(application.scheduled_time);
  const scheduleDate = getDatePart(scheduleTime);
  const scheduleTimeSlot = getTimePart(scheduleTime);

  return (
    <div className="grid gap-2">
      <div className="grid min-w-0 gap-2 xl:grid-cols-[minmax(12rem,1fr)_minmax(9rem,0.7fr)_minmax(7rem,0.45fr)_minmax(5.5rem,auto)]">
        <Select
          value={managerId || "none"}
          onValueChange={(value) =>
            onDraftChange(application.id, {
              managerId: !value || value === "none" ? "" : value,
            })
          }
        >
          <SelectTrigger className="w-full min-w-0">
            <SelectValue>{managerLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select a hiring manager</SelectItem>
            {managers.map((manager) => (
              <SelectItem key={manager.id} value={String(manager.id)}>
                {manager.name} ({manager.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          aria-label={`Interview date for application ${application.id}`}
          onChange={(event) =>
            onDraftChange(application.id, {
              scheduleTime: composeDatetimeValue(
                event.target.value,
                scheduleTimeSlot || OFFICE_HOUR_TIME_SLOTS[0],
              ),
            })
          }
          type="date"
          value={scheduleDate}
        />
        <Select
          value={scheduleTimeSlot || "none"}
          onValueChange={(value) =>
            onDraftChange(application.id, {
              scheduleTime:
                !value || value === "none"
                  ? ""
                  : composeDatetimeValue(scheduleDate, value),
            })
          }
        >
          <SelectTrigger className="w-full min-w-0">
            <SelectValue>
              {scheduleTimeSlot
                ? formatOfficeHourSlot(scheduleTimeSlot)
                : "Time"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Time</SelectItem>
            {OFFICE_HOUR_TIME_SLOTS.map((timeSlot) => (
              <SelectItem key={timeSlot} value={timeSlot}>
                {formatOfficeHourSlot(timeSlot)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          disabled={busyAction === `schedule-${application.id}`}
          onClick={() => onSchedule(application.id)}
          size="sm"
          type="button"
          variant={application.interview_id ? "outline" : "default"}
        >
          {busyAction === `schedule-${application.id}`
            ? "Scheduling..."
            : application.interview_id
              ? "Update"
              : "Schedule"}
        </Button>
      </div>
      {application.scheduled_time ? (
        <p className="text-xs text-muted-foreground">
          Saved: {new Date(application.scheduled_time).toLocaleString()}
        </p>
      ) : null}
    </div>
  );
}

function getApplicationStage(application: Application): ApplicationStage {
  if (application.status === "Offer pending" || application.status === "OFFER_PENDING") {
    return "offerPending";
  }
  if (application.status === "On hold" || application.status === "ON_HOLD") {
    return "onHold";
  }
  if (application.status === "Hired") return "hired";
  if (application.status === "Rejected") return "rejected";
  if (application.hiring_manager_recommendation) return "hmDecision";
  if (application.interview_id) {
    if (!application.scheduled_time) return "prequalified";
    const scheduledAt = new Date(application.scheduled_time).getTime();
    if (Number.isNaN(scheduledAt)) return "prequalified";
    return "scheduled";
  }
  if (
    application.status === "Pre-qualified" ||
    application.status === "PRE_QUALIFIED"
  ) {
    return "prequalified";
  }
  return "new";
}

function applicationMatchesStage(
  application: Application,
  stage: ApplicationStage,
) {
  return getApplicationStage(application) === stage;
}

function stageBadgeClass(stage: ApplicationStage) {
  switch (stage) {
    case "new":
      return "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200";
    case "prequalified":
      return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200";
    case "scheduled":
      return "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200";
    case "hmDecision":
      return "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200";
    case "offerPending":
      return "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200";
    case "onHold":
      return "border-zinc-300 bg-zinc-100 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200";
    case "hired":
      return "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200";
    case "rejected":
      return "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200";
    default:
      return "";
  }
}

function ApplicationStageBadge({ application }: { application: Application }) {
  const stage = getApplicationStage(application);
  const label =
    applicationStages.find((item) => item.value === stage)?.label || application.status;

  return (
    <div className="grid gap-1">
      <Badge
        className={cn(
          "w-fit max-w-full whitespace-normal border text-left leading-5",
          stageBadgeClass(stage),
        )}
        variant="outline"
      >
        {label}
      </Badge>
      {application.scheduled_hiring_manager_name ? (
        <span className="break-words text-xs text-muted-foreground">
          {application.scheduled_hiring_manager_name}
        </span>
      ) : null}
      {application.hiring_manager_recommendation ? (
        <span className="break-words text-xs text-muted-foreground">
          HM: {application.hiring_manager_recommendation}
        </span>
      ) : null}
    </div>
  );
}

function toDatetimeLocalValue(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function getDatePart(value: string) {
  return value.includes("T") ? value.split("T")[0] : "";
}

function getTimePart(value: string) {
  return value.includes("T") ? value.split("T")[1]?.slice(0, 5) || "" : "";
}

function composeDatetimeValue(date: string, time: string) {
  return date && time ? `${date}T${time}` : "";
}

function formatOfficeHourSlot(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return new Date(2026, 0, 1, hour, minute).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function EvaluationNotes({ application }: { application: Application }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3">
      <div className="grid gap-3 md:grid-cols-2">
        <section>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground">
            Resume/JD comment
          </h3>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6">
            {application.resume_comment || "No resume comment generated yet."}
          </p>
        </section>
        <section>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground">
            Q&A comment
          </h3>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6">
            {application.answer_comment || "No Q&A comment generated yet."}
          </p>
        </section>
      </div>
    </div>
  );
}
