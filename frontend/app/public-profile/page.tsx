'use client';

// This page handles the default public profile route
// Users are redirected to /public-profile/[token]
export default function PublicProfilePage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <p className="text-white text-lg">Please provide a valid portfolio token</p>
    </div>
  );
}
