'use client';

import TopNavigation from '@/components/TopNavigation';
import MultiStepBarForm from '@/components/MultiStepBarForm';

export default function SubmitBarPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <TopNavigation />
      <MultiStepBarForm />
    </div>
  );
}
