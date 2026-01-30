import React, { useEffect, useState } from 'react'
import { PlusCircle, X, CheckCircle2, ExternalLink, User, Hash, Check, ChevronRight, Monitor, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import { useToast } from '../../ToastContext/ToastContext';
import { createCase, previewCaseId, clearCreatedCase } from '../../features/CaseSlice/CaseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const CreateNewCase = () => {

    const {showToast} = useToast();
    const dispatch = useDispatch();
    const {caseType} = useParams();

    const {caseID, loading, error, success, createdCase} = useSelector((state)=>state.cases);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [activeStep, setActiveStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        customerName: "",
        phone: "",
        altPhone: "",
        email: "",
        country: "USA",
        state: "",
        city: "",
        address: "",
        remoteAccess: [
            {
                remoteID: "",
                remotePass: "",
                operatingSystem: "",
                computerPass: "",
            },
        ],
        issue: "",
        modelNo: "",
        workToBeDone: "",
        specialNotes: "",
        securitySoftware: "",
        plan: "",
        planDuration: "",
        validity: "",
        saleAmount: "",
        status: "Open",
    });

    const operatingSystems = [
        "Windows 10",
        "Windows 11",
        "macOS",
        "Linux Ubuntu",
        "Linux Mint",
    ];

    const planOptions = ["Silver", "Gold", "Platinum"];

    useEffect(()=>{
        if(success && createdCase){
            setShowSuccessModal(true);
        }
    },[success, createdCase]);

    useEffect(() => {
            return () => {
                setFormData({
                    customerName: "",
                    phone: "",
                    altPhone: "",
                    email: "",
                    address: "",
                    city: "",
                    state: "",
                    country: "",
                    remoteAccess: [
                        {
                            remoteID: "",
                            remotePass: "",
                            operatingSystem: "",
                            computerPass: "",
                        },
                    ],
                    issue: "",
                    modelNo: "",
                    workToBeDone: "",
                    specialNotes: "",
                    securitySoftware: "",
                    plan: "",
                    planDuration: "",
                    validity: "",
                    saleAmount: "",
                    status: "Open",
                });
            };
        }, []);

    useEffect(() => {
                if (formData.planDuration) {
                    const currentDate = new Date();
                    let validityDate;
        
                    if (formData.planDuration === "Lifetime") {
                        validityDate = "Lifetime";
                    } else {
                        const years = parseInt(formData.planDuration);
                        validityDate = new Date(
                            currentDate.getFullYear() + years,
                            currentDate.getMonth(),
                            currentDate.getDate()
                        );
                        validityDate = validityDate.toISOString().split("T")[0];
                    }
        
                    setFormData((prev) => ({ ...prev, validity: validityDate }));
                }
            }, [formData.planDuration]);
    
    useEffect(()=>{
        dispatch(previewCaseId(caseType));
    },[caseType]);

    const labelClass = "text-xs font-bold text-slate-500 uppercase tracking-widest ml-1";
    

    const inputClass = (hasError) =>
        `w-full px-5 py-4 rounded-2xl bg-slate-50 border font-bold text-sm outline-none transition-all resize-none
        ${hasError
            ? 'border-rose-500 bg-rose-50/30'
            : 'border-slate-100 focus:border-emerald-500 focus:bg-white'
    }`;

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const handleInputChangeWithErrorClear = (field, value) => {
        handleInputChange(field, value);
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: false }));
        }
    };

    const validateSteps = (step) => {
        const newErrors = {};

        if(step == 0){
            if(!formData.customerName) newErrors.customerName = true;
            if(!formData.phone) newErrors.phone = true;
            if(!formData.email) newErrors.email = true;
            if(!formData.country) newErrors.country = true;
            if(!formData.state) newErrors.state = true;
            if(!formData.city) newErrors.city = true;
            if(!formData.address) newErrors.address = true;
        } 
        if(step == 1){
             const remoteErrors = [];

            formData.remoteAccess.forEach((remote, index) => {
            const err = {};

            if (!remote.remoteID.trim()) err.remoteID = true;
            if (!remote.remotePass.trim()) err.remotePass = true;
            if (!remote.operatingSystem.trim()) err.operatingSystem = true;
            if (!remote.computerPass.trim()) err.computerPass = true;

            if (Object.keys(err).length > 0) {
                remoteErrors[index] = err;
            }
            });

            if (remoteErrors.length > 0) {
            newErrors.remoteAccess = remoteErrors;
            }

            if (!formData.issue.trim()) newErrors.issue = true;
            if (!formData.modelNo.trim()) newErrors.modelNo = true;
            if (!formData.workToBeDone.trim()) newErrors.workToBeDone = true;

            if (!formData.securitySoftware.trim()) newErrors.securitySoftware = true;
            if (!formData.plan.trim()) newErrors.plan = true;
            if (!formData.planDuration.trim()) newErrors.planDuration = true;
            if (!formData.saleAmount.trim()) newErrors.saleAmount = true;
        }

        setErrors(newErrors);

        if(Object.keys(newErrors).length > 0){
            showToast("All * feilds are required", "error");
            return false;
        }

        return true;
    }

    const handleNext = () => {
        if (validateSteps(activeStep)) {
            setActiveStep((prev) => prev + 1);
        }
    };


    const handleBack = () => {
        setActiveStep(0)
    }

    const addRemoteAccess = () => {
        setFormData((prev) => ({
            ...prev,
            remoteAccess: [
            ...prev.remoteAccess,
            {
                remoteID: "",
                remotePass: "",
                operatingSystem: "",
                computerPass: "",
            },
            ],
        }));
        };

    const handleRemoteAccessChangeWithErrorClear = (index, field, value) => {
  setFormData((prev) => {
    const updated = [...prev.remoteAccess];
    updated[index] = { ...updated[index], [field]: value };
    return { ...prev, remoteAccess: updated };
  });

  if (errors?.remoteAccess?.[index]?.[field]) {
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      updatedErrors.remoteAccess[index][field] = false;
      return updatedErrors;
    });
  }
};


const removeRemoteAccess = (index) => {
  setFormData((prev) => ({
    ...prev,
    remoteAccess: prev.remoteAccess.filter((_, i) => i !== index),
  }));

  setErrors((prev) => {
    if (!prev.remoteAccess) return prev;

    return {
      ...prev,
      remoteAccess: prev.remoteAccess.filter((_, i) => i !== index),
    };
  });
};

const handleSubmit = async () => {
    if (!validateSteps(1)) return;

    let submitData;

    submitData = {
        ...formData,
        caseType,
        remoteID: formData.remoteAccess[0].remoteID,
        remotePass: formData.remoteAccess[0].remotePass,
        operatingSystem: formData.remoteAccess[0].operatingSystem,
        computerPass: formData.remoteAccess[0].computerPass,
    };

    delete submitData.remoteAccess;

    console.log("Form Data to Submit:", submitData);

    try {
        const result = await dispatch(createCase(submitData)).unwrap();
        console.log("Success:", result);

        showToast("Form submitted successfully!", "success");

        // Reset form
        setFormData({
            customerName: "",
            phone: "",
            altPhone: "",
            email: "",
            country: "USA",
            state: "",
            city: "",
            address: "",
            remoteAccess: [
                {
                    remoteID: "",
                    remotePass: "",
                    operatingSystem: "",
                    computerPass: "",
                },
            ],
            issue: "",
            modelNo: "",
            workToBeDone: "",
            specialNotes: "",
            securitySoftware: "",
            plan: "",
            planDuration: "",
            validity: "",
            saleAmount: "",
            status: "Open",
        });

        setErrors({});
        setActiveStep(0);
    } catch (error) {
        console.error("Submit error:", error);
        showToast(error || "Failed to submit the form", "error");
    }
};


// handle close modal
const handleCloseModal = ()=>{
    setShowSuccessModal(false);
    dispatch(clearCreatedCase());
}


  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-50 p-4 rounded-3xl text-emerald-600">
              <PlusCircle size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">New {caseType} Case Form</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Step {activeStep + 1} of 2</p>
            </div>
          </div>
          <div className="relative text-center overflow-hidden rounded-3xl bg-white  p-2">

            <p className="text-base font-bold uppercase tracking-wider text-slate-500">
                Case ID: <span className=" font-black tracking-wide text-slate-800">
                {caseID?.previewCaseID || "—"}
            </span>
            </p>
            <p className="text-[11px] text-slate-400">
                This ID will be confirmed when the case is created
            </p>
            </div>

        </div>
      </div>


          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 md:p-12">

                {activeStep == 0 ? (
                    <div className='space-y-6'>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className={labelClass}> Customer Name <span className='text-rose-500 text-md'>*</span></label>
                                <input name='customerName' type="text" className={inputClass(errors?.customerName)} value={formData.customerName} onChange={(e) =>
                                        handleInputChangeWithErrorClear(
                                            "customerName",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter customer name" />
                            </div>
                            <div>
                                <label className={labelClass}> Phone Number <span className='text-rose-500 text-md'>*</span></label>
                                <input name='phone' type="text" className={inputClass(errors?.phone)} value={formData.phone} onChange={(e) =>
                                        handleInputChangeWithErrorClear(
                                            "phone",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter customer phone number" />
                            </div>
                            <div>
                                <label className={labelClass}>Alternate Phone Number </label>
                                <input name='altPhone' type="text" className={inputClass(errors?.altPhone)} value={formData.altPhone} onChange={(e) =>
                                        handleInputChangeWithErrorClear(
                                            "altPhone",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter customer alternate phone number" />
                            </div>
                            <div>
                                <label className={labelClass}>Email <span className='text-rose-500 text-md'>*</span></label>
                                <input name='email' type="text" className={inputClass(errors?.email)} value={formData.email} onChange={(e) =>
                                        handleInputChangeWithErrorClear(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter customer email" />
                            </div>
                            <div>
                                <label className={labelClass}>Country <span className='text-rose-500 text-md'>*</span></label>
                                <input name='country' type="text" className={inputClass(errors?.country)} value={formData.country} onChange={(e) =>
                                        handleInputChangeWithErrorClear(
                                            "country",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter customer country" />
                            </div>
                            <div>
                                <label className={labelClass}>State <span className='text-rose-500 text-md'>*</span></label>
                                <input name='state' type="text" className={inputClass(errors?.state)} value={formData.state} onChange={(e) =>
                                        handleInputChangeWithErrorClear(
                                            "state",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter customer state" />
                            </div>
                            <div>
                                <label className={labelClass}>City <span className='text-rose-500 text-md'>*</span></label>
                                <input name='city' type="text" className={inputClass(errors?.city)} value={formData.city} onChange={(e) =>
                                        handleInputChangeWithErrorClear(
                                            "city",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter customer city" />
                            </div>
                            <div>
                                <label className={labelClass}>Street Address <span className='text-rose-500 text-md'>*</span></label>
                                <input name='address' type="text" className={inputClass(errors?.address)} value={formData.address} onChange={(e) =>
                                        handleInputChangeWithErrorClear(
                                            "address",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter customer street address" />
                            </div>
                        </div>
                        <div className='flex justify-center mt-10'>
                            <button
                            onClick={handleNext}
                             className='bg-emerald-600 cursor-pointer text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2'
                             >Next</button>
                        </div>
                    </div>
                ) : (
                    <div className='space-y-2'>
                        <div className='bg-gray-200 p-4 rounded-3xl '>
                            <h3 className="text-lg font-bold text-slate-700 mb-4">
                                Remote Access Information
                                </h3>

                                {formData.remoteAccess.map((remote, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-6"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-slate-600">
                                        Remote Access {index + 1}
                                    </h4>

                                    {formData.remoteAccess.length > 1 && (
                                        <button
                                        type="button"
                                        onClick={() => removeRemoteAccess(index)}
                                        className="text-rose-500 font-bold text-lg"
                                        >
                                        ×
                                        </button>
                                    )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Remote ID */}
                                    <div>
                                        <label className={labelClass}>
                                        Remote ID <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                        className={inputClass(
                                            errors?.remoteAccess?.[index]?.remoteID
                                        )}
                                        value={remote.remoteID}
                                        onChange={(e) =>
                                            handleRemoteAccessChangeWithErrorClear(
                                            index,
                                            "remoteID",
                                            e.target.value
                                            )
                                        }
                                        placeholder="Enter remote ID"
                                        />
                                    </div>

                                    {/* Remote Password */}
                                    <div>
                                        <label className={labelClass}>
                                        Remote Password <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                        type="text"
                                        className={inputClass(
                                            errors?.remoteAccess?.[index]?.remotePass
                                        )}
                                        value={remote.remotePass}
                                        onChange={(e) =>
                                            handleRemoteAccessChangeWithErrorClear(
                                            index,
                                            "remotePass",
                                            e.target.value
                                            )
                                        }
                                        placeholder="Enter remote password"
                                        />
                                    </div>

                                    {/* OS */}
                                    <div>
                                        <label className={labelClass}>
                                        Operating System <span className="text-rose-500">*</span>
                                        </label>
                                        <select
                                        className={inputClass(
                                            errors?.remoteAccess?.[index]?.operatingSystem
                                        )}
                                        value={remote.operatingSystem}
                                        onChange={(e) =>
                                            handleRemoteAccessChangeWithErrorClear(
                                            index,
                                            "operatingSystem",
                                            e.target.value
                                            )
                                        }
                                        >
                                        <option value="">Select OS</option>
                                        {operatingSystems.map((os) => (
                                            <option key={os} value={os}>
                                            {os}
                                            </option>
                                        ))}
                                        </select>
                                    </div>

                                    {/* Computer Password */}
                                    <div>
                                        <label className={labelClass}>
                                        Computer Password <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                        type="text"
                                        className={inputClass(
                                            errors?.remoteAccess?.[index]?.computerPass
                                        )}
                                        value={remote.computerPass}
                                        onChange={(e) =>
                                            handleRemoteAccessChangeWithErrorClear(
                                            index,
                                            "computerPass",
                                            e.target.value
                                            )
                                        }
                                        placeholder="Enter computer password"
                                        />
                                    </div>
                                    </div>
                                </div>
                                ))}

                                <button
                                type="button"
                                onClick={addRemoteAccess}
                                className="mt-4 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition"
                                >
                                + Add Remote Access
                                </button>

                        </div>

                        <div className='bg-gray-200 p-4 rounded-3xl '> 
                            <h3 className="text-lg font-bold text-slate-700 mb-4">Case Information</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                            <div>
                                <label className={labelClass}>Issue <span className='text-rose-500 text-md'>*</span> </label>
                                <textarea name="issue" type='text' className={inputClass(errors?.issue)} value={formData.issue} onChange={(e) =>
                                        handleInputChangeWithErrorClear(
                                            "issue",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter customer issue" />
                            </div>
                            <div>
                                <label className={labelClass}>Model No <span className='text-rose-500 text-md'>*</span></label>
                                <input name='modelNo' type="text" className={inputClass(errors?.modelNo)} value={formData.modelNo} onChange={(e) =>
                                        handleInputChangeWithErrorClear(
                                            "modelNo",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter model no" />
                            </div>
                                </div>
                            <div>
                                <label className={labelClass}>Work To Be Done <span className='text-rose-500 text-md'>*</span> </label>
                                <textarea name="workToBeDone" type='text' className={inputClass(errors?.workToBeDone)} value={formData.workToBeDone} onChange={(e) =>
                                        handleInputChangeWithErrorClear(
                                            "workToBeDone",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter Work To Be Done" />
                            </div>
                            <div>
                                <label className={labelClass}>Special Note </label>
                                <textarea name="specialNotes" type='text' className={inputClass(errors?.specialNotes)} value={formData.specialNotes} onChange={(e) =>
                                        handleInputChangeWithErrorClear(
                                            "specialNotes",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Any Special Note" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className={labelClass}>
                                    Security Software <span className="text-rose-500">*</span>
                                </label>

                                <input type="text" name='securitySoftware' className={inputClass(errors?.securitySoftware)} onChange={(e)=>
                                        handleInputChangeWithErrorClear(
                                            "securitySoftware",
                                            e.target.value
                                        )
                                    } />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Plan <span className="text-rose-500">*</span>
                                </label>

                                <select
                                    className={inputClass(errors?.plan)}
                                    value={formData.plan}
                                    onChange={(e) =>
                                    handleInputChangeWithErrorClear("plan", e.target.value)
                                    }
                                >
                                    <option value="">Select Plan</option>
                                    {planOptions.map((plan) => (
                                    <option key={plan} value={plan}>
                                        {plan}
                                    </option>
                                    ))}
                                </select>
                                </div>

                                 <div>
                                    <label className={labelClass}>
                                    Plan Duration <span className="text-rose-500">*</span>
                                    </label>

                                    <select
                                    className={inputClass(errors?.planDuration)}
                                    value={formData.planDuration}
                                    onChange={(e) =>
                                        handleInputChangeWithErrorClear(
                                        "planDuration",
                                        e.target.value
                                        )
                                    }
                                    >
                                    <option value="">Select Duration</option>

                                    {[...Array(10)].map((_, i) => {
                                        const years = i + 1;
                                        return (
                                        <option
                                            key={years}
                                            value={`${years} Year${years > 1 ? "s" : ""}`}
                                        >
                                            {years} Year{years > 1 ? "s" : ""}
                                        </option>
                                        );
                                    })}

                                    <option value="Lifetime">Lifetime</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Validity</label>

                                    <input
                                    type="text"
                                    value={formData.validity}
                                    disabled
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-100 font-bold text-sm text-slate-500 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Sale Amount <span className="text-rose-500">*</span></label>
                                    <input type="text" name='saleAmount' className={inputClass(errors?.saleAmount)} onChange={(e)=>
                                        handleInputChangeWithErrorClear(
                                            "saleAmount",
                                            e.target.value
                                        )
                                    } />
                                </div>


                            </div>
                            
                        </div>

                                    <div className='flex justify-evenly mt-8'>
                                        <button
                                        onClick={handleBack}
                                     className='bg-emerald-600 cursor-pointer text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2'                                
                                        >Back</button>
                                        <button
                                        onClick={handleSubmit}
                             className='bg-emerald-600 cursor-pointer text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2'                                        
                                        >Submit</button>
                                    </div>


                    </div>
                )}


            </div>

              {/* Success Result Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="bg-emerald-600 p-4 xl:p-10 text-center relative">
                            <button 
                                onClick={handleCloseModal}
                                className="absolute cursor-pointer top-8 right-8 text-white/60 hover:text-white transition-colors bg-white/10 p-2 rounded-full"
                            >
                                <X size={20} />
                            </button>
                            <div className="bg-white/10 w-18 h-18 rounded-[2rem] rotate-12 flex items-center justify-center mx-auto mb-6 border border-white/20">
                                <CheckCircle2 size={40} className="text-white -rotate-12" />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Case Generated</h2>
                            {/* <p className="text-emerald-100 text-xs font-bold uppercase tracking-[0.2em] mt-3 opacity-80">Server Confirmation Received</p> */}
                        </div>

                        {/* Modal Body: Result Display */}
                        <div className="p-10 pt-8 space-y-6">
                            <div className="space-y-4">
                                {/* Primary ID Result */}
                                <div className="bg-emerald-50 rounded-[2rem] p-6 border border-emerald-100/50 flex items-center justify-between group">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-white p-3 rounded-2xl text-emerald-600 shadow-sm">
                                            <Hash size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Confirmed Case ID</p>
                                            <p className="text-2xl font-black text-emerald-900 tracking-tight">{createdCase?.caseId}</p>
                                        </div>
                                    </div>
                                    <button 
                                        // onClick={() => copyToClipboard(submissionResult?.caseId)}
                                        className="p-4 bg-white rounded-2xl transition-all text-emerald-400 hover:text-emerald-700 shadow-sm border border-emerald-100 active:scale-95"
                                    >
                                        {<Check size={22} className="text-emerald-600" /> }
                                    </button>
                                </div>

                                {/* Secondary Data Points */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <User size={12} className="text-slate-400" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Name</p>
                                        </div>
                                        <p className="text-sm font-black text-slate-800 truncate">{createdCase?.customerName}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Hash size={12} className="text-slate-400" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CustomerID</p>
                                        </div>
                                        <p className="text-sm font-black text-slate-800 truncate">{createdCase?.customerID}</p>
                                    </div>
                                </div>

                                {/* Summary Footer */}
                                <div className="flex items-center justify-center px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {/* <div className="flex items-center gap-2">
                                        <Calendar size={12} />
                                        <span>{createdCase?.createdAt || "Now"}</span>
                                    </div> */}
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={12} />
                                        <span>Sale Amount: ${createdCase?.saleAmount}</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleCloseModal}
                                className="w-full cursor-pointer bg-slate-900 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                            >
                                Close & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}


        
    </div>
  )
}

export default CreateNewCase;