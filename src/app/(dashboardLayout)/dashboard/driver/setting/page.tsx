"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Plus, Edit2, Trash2, X, Check, Lock, CreditCard, Building2 } from "lucide-react";
import {
  useGetProfileDataQuery,
  useUpdateProfileDataMutation,
  getProfileAvatar,
  getProfileEmail,
  getProfileName,
  getSettingsTabFromParam,
  getSettingsTabParam,
  getUpdatedProfileData,
  type UpdateProfilePayload,
  type SettingsTab,
  type SettingsMenuItem,
} from "@/service/profile/profileApi";
import {
  unwrapCompanies,
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useGetCompaniesQuery,
  useSwitchCompanyMutation,
  useUpdateCompanyMutation,
  type CompanyFormValues,
  type CompanyProfileItem,
} from "@/service/companies/companiesApi";
import {
  useGetCurrentSubscriptionQuery,
  useGetSubscriptionBillingDetailsQuery,
  useGetBillingPlansQuery,
  useCreateSubscriptionCheckoutMutation,
  useCancelUserSubscriptionMutation,
  useGetPaymentMethodsQuery,
  useAttachPaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useDeletePaymentMethodMutation,
  mapCurrentSubscription,
  mapBillingPlans,
  mapSavedPaymentMethods,
  formatBillingMoney,
  formatBillingDate,
} from "@/service/billing/billingApi";
import { useChangePasswordMutation } from "@/service/auth/authApi";
import { stripePromise } from "@/lib/stripe";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { appAlert } from "@/utils/appAlert";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

// ProfileSection Sub-component
const ProfileSection = ({
  name,
  email,
  avatarUrl,
  isUpdating,
  onNameChange,
  onAvatarChange,
  onSave,
}: {
  name: string;
  email: string;
  avatarUrl: string | null;
  isUpdating: boolean;
  onNameChange: (name: string) => void;
  onAvatarChange: (file: File) => void;
  onSave: () => void;
}) => {
  const [loadError, setLoadError] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        appAlert.fire({
          icon: "error",
          title: "File Too Large",
          text: "The file size exceeds the 2MB limit. Please choose a smaller file.",
        });
        return;
      }
      if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
        appAlert.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Only JPEG, PNG, and WebP image files are allowed.",
        });
        return;
      }
      onAvatarChange(file);
      setLoadError(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900">Photo</h3>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
            {avatarUrl && !loadError ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={() => setLoadError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-amber-100 text-amber-700">
                {name ? name.slice(0, 2).toUpperCase() : "DR"}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="profile-avatar-input"
            />
            <label
              htmlFor="profile-avatar-input"
              className="px-4 py-2 bg-[#4CAF50] hover:bg-[#439e47] text-white text-xs font-semibold rounded-full cursor-pointer transition-colors shadow-sm active:scale-[0.98]"
            >
              Change Photo
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h3 className="text-base font-bold text-gray-900">Personal Information</h3>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-[#F8F9FA] rounded-xl text-xs font-semibold text-gray-800 focus:outline-none border border-transparent focus:border-[#4CAF50]/30 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              value={email || ""}
              disabled
              className="w-full px-4 py-3 bg-[#F8F9FA] border border-[#4CAF50]/20 rounded-xl text-xs font-semibold text-gray-500 focus:outline-none pr-24 select-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8EE] text-[#4CAF50] border border-green-100/30">
              Verified
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-start pt-4">
        <button
          onClick={onSave}
          disabled={isUpdating}
          className="px-6 py-2.5 bg-[#4CAF50] hover:bg-[#439e47] text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-sm disabled:opacity-50 active:scale-[0.98]"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

// CompanySection Sub-component
const CompanySection = ({
  companies,
  isLoading,
  isUpdating,
  onCreate,
  onUpdate,
  onDelete,
  onSwitch,
}: {
  companies: CompanyProfileItem[];
  isLoading: boolean;
  isUpdating: boolean;
  onCreate: (values: CompanyFormValues, logo?: File | null) => Promise<void>;
  onUpdate: (id: string, values: CompanyFormValues, logo?: File | null) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSwitch: (id: string) => Promise<void>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyProfileItem | null>(null);
  
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const openCreateModal = () => {
    setName("");
    setIndustry("");
    setBusinessAddress("");
    setLogoFile(null);
    setLogoPreview(null);
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const openEditModal = (company: CompanyProfileItem) => {
    setName(company.name);
    setIndustry(company.industry || "");
    setBusinessAddress(company.businessAddress || "");
    setLogoFile(null);
    setLogoPreview(company.logoUrl || null);
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      appAlert.fire({ icon: "error", text: "Company name is required." });
      return;
    }

    const values = { name, industry, businessAddress };

    if (editingCompany) {
      await onUpdate(editingCompany.id, values, logoFile);
    } else {
      await onCreate(values, logoFile);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = (company: CompanyProfileItem) => {
    appAlert.fire({
      title: "Delete Company?",
      text: `Are you sure you want to delete "${company.name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await onDelete(company.id);
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Company Profiles</h3>
          <p className="text-xs text-gray-500 mt-0.5">Manage your registered company profiles and defaults.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#4CAF50] hover:bg-[#439e47] text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <Plus size={14} />
          Add Company
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((n) => (
            <div key={n} className="h-16 bg-gray-55 rounded-xl border border-gray-100" />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-200 rounded-2xl">
          <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500">No company profiles created yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {companies.map((company) => (
            <div
              key={company.id}
              className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                company.isDefault
                  ? "border-[#4CAF50] bg-green-50/10"
                  : "border-gray-150 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-gray-900">{company.name}</h4>
                    {company.isDefault && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E8F8EE] text-[#4CAF50]">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {company.industry || "Unknown Industry"} &bull; {company.businessAddress || "No Address"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!company.isDefault && (
                  <button
                    onClick={() => onSwitch(company.id)}
                    disabled={isUpdating}
                    className="px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Activate
                  </button>
                )}
                <button
                  onClick={() => openEditModal(company)}
                  className="p-1.5 border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-all cursor-pointer"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => confirmDelete(company)}
                  disabled={isUpdating}
                  className="p-1.5 border border-red-100 text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Company Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-9999 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[460px] p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold text-gray-900 mb-5">
              {editingCompany ? "Edit Company Profile" : "Add Company Profile"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4 pb-2">
                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-150 flex items-center justify-center relative shrink-0 overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Company Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="company-logo-input"
                  />
                  <label
                    htmlFor="company-logo-input"
                    className="inline-block px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Select Logo
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full px-4 py-2.5 bg-[#F8F9FA] rounded-xl text-xs font-semibold text-gray-800 border border-transparent focus:border-[#4CAF50]/30 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Logistics, Transportation"
                  className="w-full px-4 py-2.5 bg-[#F8F9FA] rounded-xl text-xs font-semibold text-gray-800 border border-transparent focus:border-[#4CAF50]/30 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Business Address</label>
                <textarea
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  placeholder="e.g. 123 Main St, New York, NY"
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#F8F9FA] rounded-xl text-xs font-semibold text-gray-800 border border-transparent focus:border-[#4CAF50]/30 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 select-none">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-bold rounded-full transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-[#4CAF50] hover:bg-[#439e47] text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// AddCardForm Internal Component (Element-dependent)
const AddCardForm = ({
  onClose,
  onAttach,
  isSubmitting,
}: {
  onClose: () => void;
  onAttach: (paymentMethodId: string) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setSubmitting(false);
      return;
    }

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (stripeError) {
      setError(stripeError.message || "An error occurred with Stripe.");
      setSubmitting(false);
    } else if (paymentMethod) {
      try {
        await onAttach(paymentMethod.id);
        onClose();
      } catch (err: any) {
        setError(getApiErrorMessage(err, "Failed to attach payment method."));
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-[#F8F9FA] rounded-xl border border-gray-150">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "13px",
                color: "#1f2937",
                "::placeholder": {
                  color: "#9ca3af",
                },
              },
              invalid: {
                color: "#ef4444",
              },
            },
          }}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-bold rounded-full cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || submitting || isSubmitting}
          className="px-5 py-2 bg-[#4CAF50] hover:bg-[#439e47] text-white text-xs font-bold rounded-full cursor-pointer shadow-sm disabled:opacity-50"
        >
          {submitting || isSubmitting ? "Adding..." : "Add Card"}
        </button>
      </div>
    </form>
  );
};

// AddCardModal Wrapper Component
const AddCardModal = ({
  open,
  onClose,
  onAttach,
  isSubmitting,
}: {
  open: boolean;
  onClose: () => void;
  onAttach: (paymentMethodId: string) => Promise<void>;
  isSubmitting: boolean;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-9999 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-[420px] p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
        >
          <X size={18} />
        </button>
        <h3 className="text-base font-bold text-gray-900 mb-5">Add New Payment Card</h3>
        <Elements stripe={stripePromise}>
          <AddCardForm onClose={onClose} onAttach={onAttach} isSubmitting={isSubmitting} />
        </Elements>
      </div>
    </div>
  );
};

// BillingSection Sub-component
const BillingSection = () => {
  const { data: subResponse, isLoading: subLoading, refetch: refetchSub } = useGetCurrentSubscriptionQuery();
  const { data: plansResponse, isLoading: plansLoading } = useGetBillingPlansQuery();
  const { data: cardsResponse, isLoading: cardsLoading, refetch: refetchCards } = useGetPaymentMethodsQuery();

  const [createCheckout, { isLoading: isCheckingOut }] = useCreateSubscriptionCheckoutMutation();
  const [cancelSubscription, { isLoading: isCancelingSub }] = useCancelUserSubscriptionMutation();
  const [attachCard, { isLoading: isAttachingCard }] = useAttachPaymentMethodMutation();
  const [setDefaultCard, { isLoading: isSettingDefault }] = useSetDefaultPaymentMethodMutation();
  const [deleteCard, { isLoading: isDeletingCard }] = useDeletePaymentMethodMutation();

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [checkingOutPlanId, setCheckingOutPlanId] = useState("");

  const currentSub = mapCurrentSubscription(subResponse?.data);
  const plans = mapBillingPlans(plansResponse?.data);
  const cards = mapSavedPaymentMethods(cardsResponse?.data);

  const handleCheckout = async (planId: string) => {
    try {
      setCheckingOutPlanId(planId);
      const res = await createCheckout({ planId }).unwrap();
      const secret = res?.data?.clientSecret || res?.data?.ClientSecret || res?.data?.client_secret;
      const sessionId = res?.data?.sessionId;

      if (sessionId) {
        const stripe = await stripePromise;
        // await stripe?.redirectToCheckout({ sessionId });
      } else if (secret) {
        appAlert.fire({
          icon: "info",
          title: "Payment Action Needed",
          text: "Stripe requires interactive confirmation. Standard redirect was not returned.",
        });
      } else {
        appAlert.fire({
          icon: "success",
          title: "Plan Configured",
          text: "Subscription configuration initiated successfully.",
        });
        refetchSub();
      }
    } catch (err: any) {
      appAlert.fire({
        icon: "error",
        text: getApiErrorMessage(err, "Failed to start plan checkout."),
      });
    } finally {
      setCheckingOutPlanId("");
    }
  };

  const handleCancelSub = async () => {
    if (!currentSub) return;
    appAlert.fire({
      title: "Cancel Subscription?",
      text: "Are you sure you want to cancel your current subscription plan? You will lose access to premium features at the end of your billing cycle.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await cancelSubscription(currentSub.id).unwrap();
          appAlert.fire({ icon: "success", text: "Subscription cancelled successfully." });
          refetchSub();
        } catch (err: any) {
          appAlert.fire({
            icon: "error",
            text: getApiErrorMessage(err, "Failed to cancel subscription."),
          });
        }
      }
    });
  };

  const handleAttachCard = async (paymentMethodId: string) => {
    await attachCard({ paymentMethodId }).unwrap();
    appAlert.fire({ icon: "success", text: "Payment card added successfully." });
    refetchCards();
  };

  const handleSetDefaultCard = async (cardId: string) => {
    try {
      await setDefaultCard(cardId).unwrap();
      appAlert.fire({ icon: "success", text: "Default card updated." });
      refetchCards();
    } catch (err: any) {
      appAlert.fire({ icon: "error", text: getApiErrorMessage(err, "Failed to update default card.") });
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await deleteCard(cardId).unwrap();
      appAlert.fire({ icon: "success", text: "Payment card removed." });
      refetchCards();
    } catch (err: any) {
      appAlert.fire({ icon: "error", text: getApiErrorMessage(err, "Failed to remove payment card.") });
    }
  };

  const isMutating = isCheckingOut || isCancelingSub || isAttachingCard || isSettingDefault || isDeletingCard;

  return (
    <div className="space-y-6">
      {/* Active Subscription Details */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-900">Current Plan</h3>
          <p className="text-xs text-gray-500 mt-0.5">Details about your active subscription package.</p>
        </div>

        {subLoading ? (
          <div className="h-16 bg-gray-50 animate-pulse rounded-xl border border-gray-100" />
        ) : !currentSub || !currentSub.plan ? (
          <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">You do not have an active subscription plan.</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 bg-[#F8F9FA] rounded-xl border border-gray-150 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-gray-900">{currentSub.plan.name}</h4>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E8F8EE] text-[#4CAF50]">
                  {currentSub.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{currentSub.plan.description}</p>
              <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-wide">
                Renews on: {formatBillingDate(currentSub.currentPeriodEnd)} &bull; {formatBillingMoney(currentSub.plan.price, currentSub.plan.currency)} / {currentSub.plan.interval}
              </p>
            </div>
            {currentSub.status !== "cancelled" && (
              <button
                onClick={handleCancelSub}
                disabled={isMutating}
                className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                Cancel Plan
              </button>
            )}
          </div>
        )}
      </div>

      {/* Choose Subscription Plans */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-900">Change Plan</h3>
          <p className="text-xs text-gray-500 mt-0.5">Upgrade or downgrade your active subscription package.</p>
        </div>

        {plansLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
            <div className="h-28 bg-gray-55 rounded-xl border border-gray-100" />
            <div className="h-28 bg-gray-55 rounded-xl border border-gray-100" />
          </div>
        ) : plans.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No plans available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plans.map((plan) => {
              const isCurrent = currentSub?.plan?.id === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`p-5 border rounded-xl flex flex-col justify-between transition-all ${
                    isCurrent ? "border-[#4CAF50] bg-green-50/5" : "border-gray-150 bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-gray-900">{plan.name}</h4>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E8F8EE] text-[#4CAF50]">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{plan.description}</p>
                    <p className="text-sm font-black text-gray-900 mt-3">
                      {formatBillingMoney(plan.price, plan.currency)}
                      <span className="text-[10px] text-gray-400 font-semibold"> / {plan.interval}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={isMutating || isCurrent}
                    className={`w-full mt-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 ${
                      isCurrent
                        ? "bg-gray-105 text-gray-400 border border-gray-250 cursor-default"
                        : "bg-[#4CAF50] text-white hover:bg-[#439e47]"
                    }`}
                  >
                    {checkingOutPlanId === plan.id ? "Processing..." : isCurrent ? "Active Plan" : "Choose Plan"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Saved Payment Cards */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Saved Cards</h3>
            <p className="text-xs text-gray-500 mt-0.5">Manage your saved credit/debit card information.</p>
          </div>
          <button
            onClick={() => setIsAddCardOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-[11px] font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
          >
            <Plus size={12} />
            Add Card
          </button>
        </div>

        {cardsLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-12 bg-gray-55 rounded-lg border border-gray-100" />
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl">
            <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No saved payment cards.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between p-3.5 border border-gray-150 rounded-xl bg-white hover:border-gray-255 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-gray-900">
                        {card.brand} &bull;&bull;&bull;&bull; {card.last4}
                      </p>
                      {card.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E8F8EE] text-[#4CAF50]">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider">
                      Expires: {card.expiryMonth || "MM"}/{card.expiryYear || "YY"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!card.isDefault && (
                    <button
                      onClick={() => handleSetDefaultCard(card.id)}
                      disabled={isMutating}
                      className="px-2.5 py-1 border border-gray-200 text-gray-600 hover:bg-gray-50 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Make Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    disabled={isMutating}
                    className="p-1 border border-red-100 text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddCardModal
        open={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        onAttach={handleAttachCard}
        isSubmitting={isAttachingCard}
      />
    </div>
  );
};

// SecuritySection Sub-component
const SecuritySection = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      appAlert.fire({ icon: "error", text: "All fields are required." });
      return;
    }

    if (newPassword.length < 6) {
      appAlert.fire({ icon: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      appAlert.fire({ icon: "error", text: "Passwords do not match." });
      return;
    }

    try {
      const res = await changePassword({ oldPassword, newPassword, confirmPassword }).unwrap();
      appAlert.fire({
        icon: "success",
        title: "Success",
        text: res?.message || "Password updated successfully.",
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      appAlert.fire({
        icon: "error",
        text: getApiErrorMessage(err, "Failed to update password."),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-5">
      <div>
        <h3 className="text-base font-bold text-gray-900">Security</h3>
        <p className="text-xs text-gray-500 mt-0.5">Change your profile authentication password.</p>
      </div>

      <div className="space-y-4 pt-2">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 bg-[#F8F9FA] rounded-xl text-xs font-semibold text-gray-800 border border-transparent focus:border-[#4CAF50]/30 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 bg-[#F8F9FA] rounded-xl text-xs font-semibold text-gray-800 border border-transparent focus:border-[#4CAF50]/30 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 bg-[#F8F9FA] rounded-xl text-xs font-semibold text-gray-800 border border-transparent focus:border-[#4CAF50]/30 focus:outline-none"
            required
          />
        </div>
      </div>

      <div className="flex justify-start pt-4 select-none">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-[#4CAF50] hover:bg-[#439e47] text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-sm disabled:opacity-50 active:scale-[0.98]"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
};

export default function SettingsPage() {
  const { data: profileResponse, isLoading } = useGetProfileDataQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileDataMutation();
  const { data: companiesResponse, isLoading: isCompaniesLoading } = useGetCompaniesQuery();
  const [createCompany, { isLoading: isCreatingCompany }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdatingCompany }] = useUpdateCompanyMutation();
  const [deleteCompany, { isLoading: isDeletingCompany }] = useDeleteCompanyMutation();
  const [switchCompany, { isLoading: isSwitchingCompany }] = useSwitchCompanyMutation();

  const [activeTab, setActiveTab] = useState<SettingsTab>("Profile");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Profile Form States
  const [profileName, setProfileName] = useState("");

  // Restore the selected tab from the URL and browser navigation.
  useEffect(() => {
    const syncTabFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveTab(getSettingsTabFromParam(params.get("tab")));
    };

    syncTabFromUrl();
    window.addEventListener("popstate", syncTabFromUrl);

    return () => window.removeEventListener("popstate", syncTabFromUrl);
  }, []);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);

    const url = new URL(window.location.href);
    url.searchParams.set("tab", getSettingsTabParam(tab));
    window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
  };

  // Sync API Data
  useEffect(() => {
    if (profileResponse?.data) {
      setProfileName(getProfileName(profileResponse.data));
      setImagePreview(getProfileAvatar(profileResponse.data) || null);
    }
  }, [profileResponse]);

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      const payload: UpdateProfilePayload = {
        name: profileName,
      };

      if (payload.name) {
        formData.append("name", payload.name);
      }
      if (avatarFile) {
        formData.append("picture", avatarFile);
      }

      const res = await updateProfile(formData).unwrap();

      appAlert.fire({
        icon: "success",
        title: "Profile Updated",
        text: res?.message || "Settings updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      const updatedProfile = getUpdatedProfileData(res?.data);
      if (updatedProfile) {
        setImagePreview(getProfileAvatar(updatedProfile) || null);
      }
    } catch (err: unknown) {
      console.log("Update profile error:", err);
      appAlert.fire({
        icon: "error",
        text: getApiErrorMessage(err, "Failed to save settings."),
      });
    }
  };

  const handleCreateCompany = async (values: CompanyFormValues, logo?: File | null) => {
    try {
      const res = await createCompany({ data: values, logo }).unwrap();

      appAlert.fire({
        icon: "success",
        title: "Company Created",
        text: res?.message || "Company profile created successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      console.log("Create company error:", err);
      appAlert.fire({
        icon: "error",
        text: getApiErrorMessage(err, "Failed to create company profile."),
      });
    }
  };

  const handleUpdateCompany = async (id: string, values: CompanyFormValues, logo?: File | null) => {
    try {
      const res = await updateCompany({ id, data: values, logo }).unwrap();

      appAlert.fire({
        icon: "success",
        title: "Company Info Updated",
        text: res?.message || "Company information updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      console.log("Update company error:", err);
      appAlert.fire({
        icon: "error",
        text: getApiErrorMessage(err, "Failed to save company info."),
      });
    }
  };

  const handleDeleteCompany = async (id: string) => {
    try {
      const res = await deleteCompany(id).unwrap();

      appAlert.fire({
        icon: "success",
        text: res?.message || "Company profile has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      console.log("Delete company error:", err);
      appAlert.fire({
        icon: "error",
        text: getApiErrorMessage(err, "Failed to delete company profile."),
      });
    }
  };

  const handleSwitchCompany = async (id: string) => {
    try {
      const res = await switchCompany(id).unwrap();

      appAlert.fire({
        icon: "success",
        title: "Company Switched",
        text: res?.message || "Active company changed successfully.",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      console.log("Switch company error:", err);
      appAlert.fire({
        icon: "error",
        text: getApiErrorMessage(err, "Failed to switch company profile."),
      });
    }
  };

  const companies = unwrapCompanies(companiesResponse?.data);
  const isCompanyMutating =
    isCreatingCompany || isUpdatingCompany || isDeletingCompany || isSwitchingCompany;

  const menuItems: SettingsMenuItem[] = [
    { key: "Profile", label: "Profile" },
    { key: "Company", label: "Company" },
    { key: "Billing & Plan", label: "Billing & Plan" },
    { key: "Security", label: "Security" },
  ];

  return (
    <div className="w-full flex flex-col gap-6 font-poppins select-text pb-12">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Settings</h1>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Navigation Card (1/4 width) */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col gap-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">Settings</h2>

          <div className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleTabChange(item.key)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all border-l-[5px] cursor-pointer ${isActive
                      ? "bg-green-50/50 text-[#258200] border-l-[#258200]"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 border-l-transparent"
                    }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-colors ${isActive ? "text-[#258200] opacity-100" : "text-gray-450 opacity-60"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Tab Content Card (3/4 width) */}
        <div className="md:col-span-3">
          {activeTab === "Profile" && (
            <ProfileSection
              name={profileName}
              email={getProfileEmail(profileResponse?.data)}
              avatarUrl={imagePreview}
              isUpdating={isUpdating}
              onNameChange={setProfileName}
              onAvatarChange={(file) => {
                setAvatarFile(file);
                setImagePreview(URL.createObjectURL(file));
              }}
              onSave={handleSaveProfile}
            />
          )}

          {activeTab === "Company" && (
            <CompanySection
              companies={companies}
              isLoading={isCompaniesLoading}
              isUpdating={isCompanyMutating}
              onCreate={handleCreateCompany}
              onUpdate={handleUpdateCompany}
              onDelete={handleDeleteCompany}
              onSwitch={handleSwitchCompany}
            />
          )}

          {activeTab === "Billing & Plan" && <BillingSection />}

          {activeTab === "Security" && <SecuritySection />}
        </div>
      </div>
    </div>
  );
}
