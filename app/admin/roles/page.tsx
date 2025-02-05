"use client";

import { RoleManagementForm } from "@/components/admin/role-management-form";

export default function RolesPage() {
  return (
    <div className="container max-w-4xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
        <RoleManagementForm />
      </div>
    </div>
  );
}