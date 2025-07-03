"use client";

import { useState } from "react";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";
import { AuthFlow, AuthRole } from "@/types/types";

export const AuthScreen = () => {
  const [authState, setAuthState] = useState<AuthFlow>("signIn");
  const [selectedRole, setSelectedRole] = useState<AuthRole>("super_admin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Role Selection - Only show for sign in */}
        {authState === "signIn" && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Welcome to SmartBus
            </h2>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select your role:
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="super_admin"
                    checked={selectedRole === "super_admin"}
                    onChange={(e) => setSelectedRole(e.target.value as AuthRole)}
                    className="mr-2"
                  />
                  <span className="text-sm">Super Administrator</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="school_admin"
                    checked={selectedRole === "school_admin"}
                    onChange={(e) => setSelectedRole(e.target.value as AuthRole)}
                    className="mr-2"
                  />
                  <span className="text-sm">School Administrator</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Auth Cards */}
        {authState === "signIn" ? (
          <SignInCard setState={setAuthState} role={selectedRole} />
        ) : (
          <SignUpCard setState={setAuthState}  />
        )}

        {/* Toggle between sign in and sign up - Only show signup for super admin */}
        <div className="mt-4 text-center">
          {authState === "signIn" ? (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setAuthState("signUp");
                  setSelectedRole("super_admin"); // Only super admin can sign up
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up as Super Admin
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setAuthState("signIn")}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          )}
        </div>

        {/* Info for school admins */}
        {authState === "signIn" && selectedRole === "school_admin" && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 <strong>School Administrators:</strong> You cannot create your own account. 
              Please contact your Super Administrator to get your login credentials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
