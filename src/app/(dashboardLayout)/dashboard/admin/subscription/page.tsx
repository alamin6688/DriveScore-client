"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, Save } from "lucide-react";
import {
  mapSubscriptionPlan,
  mapSubscriptionPlanPayload,
  unwrapSubscriptionPlans,
  useCreateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  useGetSubscriptionPlansQuery,
  useUpdateSubscriptionPlanMutation,
  type AdminSubscriptionPlanItem,
} from "@/service/admin/subscriptionPlan";
import { appAlert } from "@/utils/appAlert";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

// Sub-component for the plans UI
const AdminSubscriptionPlans = ({
  plans,
  isLoading,
  isError,
  isMutating,
  onCreate,
  onUpdate,
  onDelete,
}: {
  plans: AdminSubscriptionPlanItem[];
  isLoading?: boolean;
  isError?: boolean;
  isMutating?: boolean;
  onCreate: (plan: AdminSubscriptionPlanItem) => Promise<boolean>;
  onUpdate: (plan: AdminSubscriptionPlanItem) => Promise<boolean>;
  onDelete: (planId: string) => Promise<void>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AdminSubscriptionPlanItem | null>(null);
  const [newFeature, setNewFeature] = useState("");

  const [formData, setFormData] = useState<AdminSubscriptionPlanItem>({
    id: "",
    name: "",
    description: "",
    price: "0",
    features: [],
    currency: "USD",
    interval: "month",
    active: true,
    isPopular: false,
    maxPaymentMethods: null,
    maxReports: null,
    maxCompanyProfiles: null,
  });

  const openCreateModal = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      price: "0",
      features: [],
      currency: "USD",
      interval: "month",
      active: true,
      isPopular: false,
      maxPaymentMethods: null,
      maxReports: null,
      maxCompanyProfiles: null,
    });
    setEditingPlan(null);
    setNewFeature("");
    setIsModalOpen(true);
  };

  const openEditModal = (plan: AdminSubscriptionPlanItem) => {
    setFormData({ ...plan });
    setEditingPlan(plan);
    setNewFeature("");
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNumberChange = (name: string, value: string) => {
    const num = value === "" ? null : Number(value);
    setFormData((prev) => ({ ...prev, [name]: num }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      appAlert.fire({ icon: "error", text: "Plan name is required." });
      return;
    }

    let success = false;
    if (editingPlan) {
      success = await onUpdate(formData);
    } else {
      success = await onCreate(formData);
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  const confirmDelete = (plan: AdminSubscriptionPlanItem) => {
    appAlert.fire({
      title: "Are you sure?",
      text: `You are about to delete subscription plan "${plan.name}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await onDelete(plan.id);
      }
    });
  };

  return (
    <div className="w-full flex flex-col gap-6 font-poppins pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Subscription Plans</h1>
          <p className="text-xs text-gray-500 mt-1">Manage public plans and pricing configurations.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#4CAF50] hover:bg-[#439e47] text-white text-xs font-bold rounded-full shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus size={14} />
          Create New Plan
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
              <div className="h-5 bg-gray-100 rounded w-1/2"></div>
              <div className="h-8 bg-gray-100 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 border border-red-100 rounded-2xl p-6 text-center font-semibold">
          Failed to load subscription plans.
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-gray-500 font-medium">No subscription plans found.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-[#4CAF50] text-white text-xs font-bold rounded-full"
          >
            Create Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all ${
                plan.isPopular ? "border-[#4CAF50] ring-2 ring-[#4CAF50]/10" : "border-gray-100"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-3 right-3 bg-[#4CAF50] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Popular
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900">{plan.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      plan.active
                        ? "bg-[#E8F8EE] text-[#4CAF50] border-green-100/30"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                  >
                    {plan.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-2 line-clamp-2 min-h-8">{plan.description}</p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900">
                    {plan.currency === "USD" ? "$" : plan.currency}
                    {plan.price}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">/ {plan.interval}</span>
                </div>

                <div className="border-t border-gray-100 my-4 pt-4">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Features</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <Check size={12} className="text-[#4CAF50] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.features.length === 0 && (
                      <li className="text-xs text-gray-400 italic">No custom features listed.</li>
                    )}
                  </ul>
                </div>

                {/* System quotas */}
                <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Company Profiles:</span>
                    <span className="font-bold">{plan.maxCompanyProfiles ?? "Unlimited"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reports / Month:</span>
                    <span className="font-bold">{plan.maxReports ?? "Unlimited"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Methods:</span>
                    <span className="font-bold">{plan.maxPaymentMethods ?? "Unlimited"}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 border-t border-gray-100 mt-6 pt-4">
                <button
                  onClick={() => openEditModal(plan)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(plan)}
                  disabled={isMutating}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-9999 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[540px] p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold text-gray-900 mb-6">
              {editingPlan ? "Edit Subscription Plan" : "Create Subscription Plan"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Plan Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Premium Plan"
                    className="w-full px-4 py-2.5 bg-[#F8F9FA] rounded-xl text-xs font-semibold text-gray-800 border border-transparent focus:border-[#4CAF50]/30 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price ({formData.currency})</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2.5 bg-[#F8F9FA] rounded-xl text-xs font-semibold text-gray-800 border border-transparent focus:border-[#4CAF50]/30 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Interval</label>
                  <select
                    name="interval"
                    value={formData.interval}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#F8F9FA] rounded-xl text-xs font-semibold text-gray-800 border border-transparent focus:border-[#4CAF50]/30 focus:outline-none"
                  >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Currency</label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    placeholder="USD"
                    className="w-full px-4 py-2.5 bg-[#F8F9FA] rounded-xl text-xs font-semibold text-gray-800 border border-transparent focus:border-[#4CAF50]/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Plan description..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#F8F9FA] rounded-xl text-xs font-semibold text-gray-800 border border-transparent focus:border-[#4CAF50]/30 focus:outline-none resize-none"
                />
              </div>

              {/* Status Switches */}
              <div className="flex gap-6 py-2 border-y border-gray-50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="accent-[#4CAF50]"
                  />
                  <span className="text-xs font-semibold text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleInputChange}
                    className="accent-[#4CAF50]"
                  />
                  <span className="text-xs font-semibold text-gray-700">Popular (Highlighted)</span>
                </label>
              </div>

              {/* Quotas Section */}
              <div className="bg-[#F8F9FA] rounded-2xl p-4 space-y-3">
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Plan Quotas (Empty for Unlimited)</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-gray-500">Company Profiles</label>
                    <input
                      type="number"
                      value={formData.maxCompanyProfiles ?? ""}
                      onChange={(e) => handleNumberChange("maxCompanyProfiles", e.target.value)}
                      placeholder="Unlimited"
                      className="w-full px-3 py-2 bg-white rounded-lg text-xs font-semibold text-gray-800 border border-gray-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-gray-500">Reports / Month</label>
                    <input
                      type="number"
                      value={formData.maxReports ?? ""}
                      onChange={(e) => handleNumberChange("maxReports", e.target.value)}
                      placeholder="Unlimited"
                      className="w-full px-3 py-2 bg-white rounded-lg text-xs font-semibold text-gray-800 border border-gray-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-gray-500">Payment Methods</label>
                    <input
                      type="number"
                      value={formData.maxPaymentMethods ?? ""}
                      onChange={(e) => handleNumberChange("maxPaymentMethods", e.target.value)}
                      placeholder="Unlimited"
                      className="w-full px-3 py-2 bg-white rounded-lg text-xs font-semibold text-gray-800 border border-gray-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Features Builder */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Features</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
                    placeholder="e.g. Free vehicle registration"
                    className="flex-1 px-4 py-2 bg-[#F8F9FA] rounded-xl text-xs font-semibold text-gray-800 border border-transparent focus:border-[#4CAF50]/30 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-[#4CAF50] text-white text-xs font-bold rounded-xl hover:bg-[#439e47]"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 bg-[#E8F8EE] text-[#258200] text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-100/40"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-[#258200] hover:text-[#58B500] focus:outline-none shrink-0"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save / Cancel actions */}
              <div className="flex gap-3 justify-end pt-4 select-none">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-bold rounded-full transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isMutating}
                  className="px-6 py-2.5 bg-[#4CAF50] hover:bg-[#439e47] text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-sm disabled:opacity-50 active:scale-[0.98] flex items-center gap-1.5"
                >
                  <Save size={14} />
                  {editingPlan ? "Save Changes" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SubscriptionPage = () => {
  const { data: plansResponse, isLoading, isError } = useGetSubscriptionPlansQuery();
  const [createSubscriptionPlan, { isLoading: isCreating }] = useCreateSubscriptionPlanMutation();
  const [updateSubscriptionPlan, { isLoading: isUpdating }] = useUpdateSubscriptionPlanMutation();
  const [deleteSubscriptionPlan, { isLoading: isDeleting }] = useDeleteSubscriptionPlanMutation();

  const plans = unwrapSubscriptionPlans(plansResponse?.data).map(mapSubscriptionPlan);
  const isMutating = isCreating || isUpdating || isDeleting;

  const handleCreatePlan = async (plan: AdminSubscriptionPlanItem) => {
    try {
      const res = await createSubscriptionPlan(mapSubscriptionPlanPayload(plan)).unwrap();
      appAlert.fire({
        icon: "success",
        title: "Added",
        text: res?.message || "Subscription package added successfully.",
      });
      return true;
    } catch (err: unknown) {
      appAlert.fire({
        icon: "error",
        text: getApiErrorMessage(err, "Failed to add subscription plan."),
      });
      return false;
    }
  };

  const handleUpdatePlan = async (plan: AdminSubscriptionPlanItem) => {
    try {
      const res = await updateSubscriptionPlan({
        id: plan.id,
        updatedPlan: mapSubscriptionPlanPayload(plan),
      }).unwrap();

      appAlert.fire({
        icon: "success",
        text: res?.message || "Subscription package updated successfully.",
      });
      return true;
    } catch (err: unknown) {
      appAlert.fire({
        icon: "error",
        text: getApiErrorMessage(err, "Failed to update subscription plan."),
      });
      return false;
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      const res = await deleteSubscriptionPlan(planId).unwrap();
      appAlert.fire({
        icon: "success",
        text: res?.message || "Subscription plan has been deleted.",
      });
    } catch (err: unknown) {
      appAlert.fire({
        icon: "error",
        text: getApiErrorMessage(err, "Failed to delete subscription plan."),
      });
    }
  };

  return (
    <AdminSubscriptionPlans
      plans={plans}
      isLoading={isLoading}
      isError={isError}
      isMutating={isMutating}
      onCreate={handleCreatePlan}
      onUpdate={handleUpdatePlan}
      onDelete={handleDeletePlan}
    />
  );
};

export default SubscriptionPage;
