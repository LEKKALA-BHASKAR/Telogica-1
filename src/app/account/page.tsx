"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiPatch, toApiError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { updateProfile } from "@/store/authSlice";
import { useAppDispatch, useAuth } from "@/store/hooks";
import { ErrorNote, Field, Panel, SubmitButton, inputClass } from "@/components/commerce/Bits";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, submitting, error } = useAuth();

  const [profile, setProfile] = useState({ name: "", phone: "", company: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name, phone: user.phone ?? "", company: user.company ?? "" });
    }
  }, [user]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const result = await dispatch(updateProfile(profile));
    if (updateProfile.fulfilled.match(result)) toast.success("Profile updated");
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwBusy(true);
    setPwError(null);
    try {
      await apiPatch("/auth/me/password", passwords);
      setPasswords({ currentPassword: "", newPassword: "" });
      toast.success("Password changed");
    } catch (err) {
      setPwError(toApiError(err).message);
    } finally {
      setPwBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold text-white">Profile</h2>
        <p className="mt-1 text-sm text-fog">
          Member since {formatDate(user?.createdAt)}
          {user?.role === "admin" && (
            <span className="ml-2 rounded-full bg-teal/10 px-2 py-0.5 text-xs font-semibold text-teal ring-1 ring-teal/25">
              Administrator
            </span>
          )}
        </p>
      </div>

      <Panel>
        <form onSubmit={saveProfile} className="space-y-4">
          {error && <ErrorNote message={error} />}

          <Field label="Full name" htmlFor="name">
            <input
              id="name"
              required
              minLength={2}
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className={inputClass}
            />
          </Field>

          <Field label="Email" htmlFor="email" hint="Contact support to change your sign-in email.">
            <input id="email" value={user?.email ?? ""} disabled className={inputClass} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone" htmlFor="phone">
              <input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Company" htmlFor="company">
              <input
                id="company"
                value={profile.company}
                onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))}
                className={inputClass}
              />
            </Field>
          </div>

          <SubmitButton loading={submitting}>Save changes</SubmitButton>
        </form>
      </Panel>

      <Panel>
        <h3 className="font-display text-base font-bold text-white">Change password</h3>
        <form onSubmit={changePassword} className="mt-5 space-y-4">
          {pwError && <ErrorNote message={pwError} />}

          <Field label="Current password" htmlFor="currentPassword">
            <input
              id="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, currentPassword: e.target.value }))
              }
              className={inputClass}
            />
          </Field>

          <Field
            label="New password"
            htmlFor="newPassword"
            hint="At least 8 characters, including a letter and a number."
          >
            <input
              id="newPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
              className={inputClass}
            />
          </Field>

          <SubmitButton loading={pwBusy}>Update password</SubmitButton>
        </form>
      </Panel>
    </div>
  );
}
