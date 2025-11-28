import React, { useState, useEffect } from 'react';
import { Step, CharacterState } from '../types';
import { generateTextParts, enhanceCharacterWithAI, parseEnhancedOutput, validateApiKey, verifyApiKey } from '../utils';
import { X, Check, Copy, RefreshCw, Sparkles, Undo2, Redo2, Loader2, Info, Key, ExternalLink, ShieldCheck, Save } from 'lucide-react';

interface StepContentProps {
  step: Step;
  state: CharacterState;
  updateState: (key: keyof CharacterState, value: any) => void;
  invalidKeys: string[];
}

const CopyBlock: React.FC<{ title: React.ReactNode; content: string }> = ({ title, content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-6 bg-[#121212] border border-zinc-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center">{title}</h3>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-rose-500 transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-4 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
        {content}
      </div>
    </div>
  );
};

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (key: string) => void;
    onEnhance: (key: string) => void;
    initialKey: string;
}

const ApiKeyModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, onEnhance, initialKey }) => {
    const [key, setKey] = useState(initialKey);
    const [isVerified, setIsVerified] = useState(!!initialKey);
    const [validating, setValidating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Only reset state when the modal is explicitly opened, 
    // NOT when the parent component updates props (e.g. after saving)
    useEffect(() => {
        if (isOpen) {
            setKey(initialKey);
            setIsVerified(!!initialKey);
            setError('');
            setSuccess('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKey(e.target.value);
        setIsVerified(false); // Invalidate on edit
        setError('');
        setSuccess('');
    };

    const handleTestAndSave = async () => {
        if (!key.trim()) {
             setError("Please enter an API key.");
             return;
        }

        setValidating(true);
        setError('');
        setSuccess('');
        
        try {
            const isValid = await verifyApiKey(key);
            if (isValid) {
                setIsVerified(true);
                onSave(key);
                setSuccess("Key verified and saved!");
            } else {
                setIsVerified(false);
                setError('Key check failed. Please ensure you followed the steps above and your key is correct.');
            }
        } catch (e) {
            setIsVerified(false);
            setError('Verification failed. Check your network connection.');
        } finally {
            setValidating(false);
        }
    };

    const handleEnhanceClick = () => {
       if (isVerified && key.trim()) {
           onEnhance(key); 
       }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#121212] border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
                
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-rose-900/30 flex items-center justify-center border border-rose-500/30 text-rose-500">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">AI Forge Enhancement</h3>
                        <p className="text-xs text-zinc-400">Powered by Google Gemini</p>
                    </div>
                </div>

                {/* Red Box Guide */}
                <div className="bg-rose-950/20 border border-rose-900/50 rounded-lg p-4 mb-6 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/50"></div>
                     <p className="text-xs text-zinc-200 mb-3 leading-relaxed">
                        You need a Gemini API key to use this feature. It is <strong className="text-white">completely free</strong> and can be obtained by doing the following:
                     </p>
                     <ol className="list-decimal list-inside space-y-2 text-xs text-zinc-400 font-mono pl-1">
                        <li>Visit this page <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:text-rose-300 underline underline-offset-2 ml-1 inline-flex items-center gap-0.5">Google AI Studio<ExternalLink size={10}/></a>.</li>
                        <li>Click "Create API Key".</li>
                        <li>In the project dropdown click "Create Project".</li>
                        <li>Name the project and key however you like.</li>
                        <li>Click "Create key".</li>
                        <li>Click the copy button on your API Key page.</li>
                     </ol>
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">
                        API Key
                    </label>
                    <div className="relative">
                        <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input 
                            type="password" 
                            className={`w-full bg-[#09090b] border ${error ? 'border-red-500' : success ? 'border-green-500' : 'border-zinc-700'} rounded p-2.5 pl-10 text-sm text-white focus:border-rose-500 outline-none transition-colors`}
                            placeholder="Paste AIza key here..."
                            value={key}
                            onChange={handleInputChange}
                        />
                    </div>
                    {error && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><X size={12}/> {error}</p>}
                    {success && <p className="text-xs text-green-500 mt-2 flex items-center gap-1"><Check size={12}/> {success}</p>}
                    
                    <div className="flex items-center gap-2 mt-3 text-[10px] text-zinc-500">
                        <ShieldCheck size={12} />
                        <span>Stored locally in your browser session only.</span>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-3 py-2 rounded text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        disabled={validating}
                    >
                        Cancel
                    </button>
                    
                    <button 
                        onClick={handleTestAndSave}
                        disabled={validating || !key.trim()}
                        className="px-3 py-2 rounded text-xs font-bold bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-200 transition-all flex items-center gap-2"
                    >
                        {validating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Test & Save
                    </button>

                    <button 
                        onClick={handleEnhanceClick}
                        disabled={validating || !isVerified || !key.trim()}
                        className="px-4 py-2 rounded text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {validating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        Enhance
                    </button>
                </div>
            </div>
        </div>
    );
};

export const StepContent: React.FC<StepContentProps> = ({ step, state, updateState, invalidKeys }) => {
  const [customModes, setCustomModes] = useState<Record<string, boolean>>({});
  const [multiInputValues, setMultiInputValues] = useState<Record<string, string>>({});
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  // Initialize from session storage to persist across step navigation
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem('gemini_api_key') || '';
    }
    return '';
  });
  
  const [showKeyModal, setShowKeyModal] = useState(false);
  
  // Reset custom modes when step changes to avoid ghost inputs
  useEffect(() => {
    setCustomModes({});
    setMultiInputValues({});
  }, [step.id]);

  const toggleCustom = (key: string, multi?: boolean) => {
    setCustomModes(prev => {
      const isTurningOn = !prev[key];
      // Match original behavior: clicking Custom wipes standard selection for single-select
      if (isTurningOn && !multi) {
        updateState(key as keyof CharacterState, "");
      }
      return { ...prev, [key]: isTurningOn };
    });
  };

  const handleMultiSelect = (key: string, val: string, limit: number = 10) => {
    const raw = state[key];
    const current = Array.isArray(raw) ? (raw as string[]) : [];
    
    if (current.includes(val)) {
      updateState(key as keyof CharacterState, current.filter(x => x !== val));
    } else if (current.length < limit) {
      updateState(key as keyof CharacterState, [...current, val]);
    }
  };

  const handleCustomTagAdd = (key: string, val: string, limit: number = 3) => {
    if (!val.trim()) return;
    const raw = state[key];
    const current = Array.isArray(raw) ? (raw as string[]) : [];
    
    if (!current.includes(val.trim()) && current.length < limit) {
      updateState(key as keyof CharacterState, [...current, val.trim()]);
    }
  };

  const handleRephrase = () => {
    updateState('rephraseSeed', (state.rephraseSeed || 0) + 1);
  };

  const handleEnhanceClick = () => {
      setShowKeyModal(true);
  };

  const handleKeySaved = (keyInput: string) => {
      setApiKey(keyInput);
      sessionStorage.setItem('gemini_api_key', keyInput);
  };

  const handleModalEnhance = (keyInput: string) => {
      handleKeySaved(keyInput);
      setShowKeyModal(false);
      
      // Trigger enhance immediately with the fresh key
      setIsEnhancing(true);
      enhanceCharacterWithAI(state, keyInput)
        .then(enhanced => {
             updateState('enhancedOutput', enhanced);
        })
        .catch(error => {
            console.error(error);
            alert("Failed to enhance character. Please check your API Key or connection.");
        })
        .finally(() => {
            setIsEnhancing(false);
        });
  };

  const handleUndo = () => {
    updateState('lastEnhancedOutput', state.enhancedOutput);
    updateState('enhancedOutput', null);
  };

  const handleRedo = () => {
    updateState('enhancedOutput', state.lastEnhancedOutput);
  };

  // RENDER SUMMARY
  if (step.type === 'summary') {
    const { persona, details } = generateTextParts(state);
    
    // Parse enhanced output if it exists
    let enhancedPersona = "";
    let enhancedDetails = "";
    
    if (state.enhancedOutput) {
       const parsed = parseEnhancedOutput(state.enhancedOutput);
       enhancedPersona = parsed.persona;
       enhancedDetails = parsed.details;
    }
    
    const renderTitle = (base: string, isEnhanced: boolean) => (
      <span>
        {base} {isEnhanced && (
          <span className="text-rose-500 ml-1 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse">
            (AI Enhanced)
          </span>
        )}
      </span>
    );

    return (
      <div className="animate-fade-in pb-4 relative">
        <ApiKeyModal 
            isOpen={showKeyModal} 
            onClose={() => setShowKeyModal(false)}
            onSave={handleKeySaved}
            onEnhance={handleModalEnhance}
            initialKey={apiKey}
        />

        <div className="flex justify-end gap-2 mb-4">
           {/* Rephrase Button */}
           <div className="relative group">
             <button 
               onClick={handleRephrase}
               disabled={!!state.enhancedOutput}
               className={`flex items-center gap-2 px-3 py-1.5 rounded border border-zinc-700 text-xs text-zinc-300 transition-colors
                 ${state.enhancedOutput ? 'opacity-50 cursor-not-allowed bg-zinc-900' : 'bg-zinc-800 hover:bg-zinc-700'}
               `}
             >
               <RefreshCw size={14} />
               <span>Rephrase</span>
             </button>
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-zinc-900 text-white text-[10px] py-1 px-2 rounded border border-zinc-700 whitespace-nowrap z-40 shadow-xl">
               Shuffles the phrasing of the template generation.
             </div>
           </div>

           {/* Undo Button */}
           {state.enhancedOutput && (
             <div className="relative group animate-fade-in">
               <button 
                 onClick={handleUndo}
                 className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs text-zinc-300 transition-colors"
               >
                 <Undo2 size={14} />
                 <span>Undo AI</span>
               </button>
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-zinc-900 text-white text-[10px] py-1 px-2 rounded border border-zinc-700 whitespace-nowrap z-40 shadow-xl">
                 Revert to the template-based generation.
               </div>
             </div>
           )}

           {/* Redo Button */}
           {!state.enhancedOutput && state.lastEnhancedOutput && (
             <div className="relative group animate-fade-in">
               <button 
                 onClick={handleRedo}
                 className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs text-zinc-300 transition-colors"
               >
                 <Redo2 size={14} />
                 <span>Redo AI</span>
               </button>
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-zinc-900 text-white text-[10px] py-1 px-2 rounded border border-zinc-700 whitespace-nowrap z-40 shadow-xl">
                 Restore the previously generated AI text.
               </div>
             </div>
           )}

           {/* Always Visible Enhance Button */}
           <div className="relative group animate-fade-in">
              <button 
                onClick={handleEnhanceClick}
                disabled={isEnhancing}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-rose-900/30 hover:bg-rose-900/50 border border-rose-900/50 text-xs text-rose-300 transition-colors"
              >
                {isEnhancing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>{isEnhancing ? "Enhancing..." : "Enhance with AI"}</span>
              </button>
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-zinc-900 text-white text-[10px] py-1 px-2 rounded border border-zinc-700 whitespace-nowrap z-40 shadow-xl">
                 Uses Gemini AI to rewrite and expand the profile creatively.
              </div>
           </div>
        </div>
        
        {state.enhancedOutput ? (
          <div className="animate-fade-in">
            <CopyBlock title={renderTitle("Persona", true)} content={enhancedPersona || state.enhancedOutput} />
            {enhancedDetails && <CopyBlock title={renderTitle("Details", true)} content={enhancedDetails} />}
          </div>
        ) : (
          <>
            <CopyBlock title={renderTitle("Persona", false)} content={persona} />
            <CopyBlock title={renderTitle("Details", false)} content={details} />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-4">
      {/* RENDER SECTIONS (Inputs/Selects/Textareas) */}
      {step.sections && step.sections.length > 0 && (
        <div className="mb-8">
          {step.sections.map(sec => {
            const isError = invalidKeys.includes(sec.key as string);
            return (
              <div key={sec.key as string} className="mb-5">
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">
                  {sec.label} {sec.optional ? "" : <span className="text-rose-500">*</span>}
                </label>
                
                {sec.type === 'select' && sec.options ? (
                  <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 ${isError ? 'animate-shake' : ''}`}>
                    {sec.options.map(opt => {
                       const isSel = state[sec.key] === opt.value;
                       return (
                         <button
                           key={opt.value}
                           onClick={() => updateState(sec.key, opt.value)}
                           className={`p-3 rounded border text-sm flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-1 transition-all
                             ${isSel 
                               ? 'border-rose-500 bg-rose-900/20 text-white' 
                               : 'border-zinc-700 bg-[#121212] text-zinc-400 hover:bg-[#1e1e1e] hover:border-zinc-600'
                             }
                             ${isError ? 'border-red-500' : ''}
                           `}
                         >
                           <span className="text-xl">{opt.icon}</span>
                           <span>{opt.label}</span>
                         </button>
                       );
                    })}
                  </div>
                ) : sec.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={state[sec.key] || ""}
                    onChange={(e) => updateState(sec.key, e.target.value)}
                    placeholder={sec.placeholder}
                    className={`w-full p-3 rounded bg-[#121212] border text-white text-base md:text-sm placeholder-zinc-600 focus:ring-1 focus:ring-rose-500 outline-none transition-colors
                      ${isError ? 'border-red-500 animate-shake' : 'border-zinc-700 focus:border-rose-500'}
                    `}
                  />
                ) : (
                  <input
                    type="text"
                    value={state[sec.key] || ""}
                    onChange={(e) => updateState(sec.key, e.target.value)}
                    placeholder={sec.placeholder}
                    className={`w-full p-3 rounded bg-[#121212] border text-white text-base md:text-sm placeholder-zinc-600 focus:ring-1 focus:ring-rose-500 outline-none transition-colors
                      ${isError ? 'border-red-500 animate-shake' : 'border-zinc-700 focus:border-rose-500'}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* RENDER GROUPS (Grid Cards) */}
      {step.groups && step.groups.length > 0 && (
        <div>
          {step.groups.map(group => {
             const isError = invalidKeys.includes(group.key as string);
             const currentVal = state[group.key];
             
             // Check if custom is active
             // If options are empty (like custom hair length -> styles), treat as custom active if we have no valid option selected
             const isEmptyOptions = group.options.length === 0;
             const isValueInOptions = !group.multi && group.options.some(o => (o.value || o.label) === currentVal);
             const isCustomActive = customModes[group.key as string] || (!group.multi && currentVal && !isValueInOptions) || (isEmptyOptions && !group.multi);

             // SAFEGUARD: Ensure we are operating on an array if multi is true
             const valArray = Array.isArray(currentVal) ? (currentVal as string[]) : [];

             const customTags = group.multi 
                ? valArray.filter(tag => !group.options.find(o => (o.value || o.label) === tag))
                : [];
             
             const currentLength = group.multi ? valArray.length : 0;
             const isMaxReached = group.multi && group.max ? currentLength >= group.max : false;

             // Special handling for Backstory Custom Fields
             const isBackstoryCustom = group.key === 'backstoryType' && isCustomActive;

             return (
               <div key={group.key as string} className="mb-8">
                 <h3 className={`text-xs font-bold text-rose-500 uppercase tracking-widest mb-3 ${isError ? 'text-red-500' : ''}`}>
                   {group.title}
                 </h3>
                 
                 <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${isError ? 'animate-shake' : ''}`}>
                   {group.options.map(opt => {
                     const val = opt.value || opt.label;
                     const isSel = group.multi 
                       ? valArray.includes(val)
                       : currentVal === val;
                     
                     return (
                       <div
                         key={val}
                         onClick={() => {
                           if (group.multi) {
                             handleMultiSelect(group.key as string, val, group.max);
                           } else {
                             updateState(group.key, val);
                             setCustomModes(prev => ({...prev, [group.key as string]: false}));
                             // If clearing backstory custom, also clear snippet
                             if (group.key === 'backstoryType') updateState('customBackstorySnippet', '');
                           }
                         }}
                         className={`
                           relative p-3 rounded cursor-pointer flex flex-col items-center justify-center text-center h-24 border transition-all
                           ${isSel 
                             ? 'border-rose-500 bg-rose-900/20 shadow-[0_0_0_1px_rgba(244,63,94,1)]' 
                             : 'bg-[#121212] border-zinc-800 hover:translate-y-[-2px] hover:border-zinc-600 hover:bg-[#18181b]'
                           }
                           ${isMaxReached && !isSel && group.multi ? 'opacity-50 cursor-not-allowed' : ''}
                         `}
                       >
                         {opt.color && (
                           <div className="w-6 h-6 rounded-full mb-2 border border-white/10" style={{ background: opt.color }}></div>
                         )}
                         <span className="text-sm font-medium text-zinc-200 pointer-events-none">{opt.label}</span>
                       </div>
                     );
                   })}

                   {/* Custom Button - Hide if disableCustom is on, OR if options are empty (because then it's effectively always custom) */}
                   {!group.disableCustom && !isEmptyOptions && (
                     <div
                       onClick={() => toggleCustom(group.key as string, group.multi)}
                       className={`
                         relative p-3 rounded cursor-pointer flex flex-col items-center justify-center text-center h-24 border transition-all
                         ${isCustomActive 
                           ? 'border-rose-500 bg-rose-900/20 shadow-[0_0_0_1px_rgba(244,63,94,1)]' 
                           : 'bg-[#121212] border-zinc-800 hover:translate-y-[-2px] hover:border-zinc-600 hover:bg-[#18181b]'
                         }
                       `}
                     >
                       <span className="text-xl">✏️</span>
                       <span className="text-sm font-medium text-zinc-200 mt-1">Custom</span>
                     </div>
                   )}
                 </div>

                 {/* Custom Tags (Badges) for Multi-select - ABOVE INPUT */}
                 {group.multi && customTags.length > 0 && (
                   <div className="mt-3 animate-fade-in">
                      <div className="text-xs text-zinc-500 mb-1 ml-1">Custom Tags:</div>
                      <div className="flex flex-wrap gap-2">
                        {customTags.map(tag => (
                          <div key={tag} className="bg-[#27272a] border border-[#3f3f46] text-[#e4e4e7] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 group hover:border-rose-500 hover:text-rose-500 transition-colors cursor-pointer" onClick={() => handleMultiSelect(group.key as string, tag, group.max)}>
                            <span>{tag}</span>
                            <X size={12} className="text-zinc-500 group-hover:text-rose-500" />
                          </div>
                        ))}
                      </div>
                   </div>
                 )}

                 {/* Custom Input Area */}
                 {!group.disableCustom && isCustomActive && (
                   <div className="mt-3 w-full animate-fade-in bg-[#1e1e1e] border border-zinc-800 rounded p-3">
                     {isBackstoryCustom ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-2 bg-rose-900/20 p-2 rounded border border-rose-900/30 mb-1">
                                <Info size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />
                                <p className="text-[11px] text-zinc-300 leading-tight">
                                    For proper grammar generation, provide the <strong>Archetype Name</strong> (e.g., Time Traveler) and a <strong>Snippet</strong> describing their past, starting with a past-tense verb (e.g., "traveled back to warn humanity").
                                </p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Archetype Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Time Traveler"
                                    className="w-full p-2 bg-[#121212] border border-zinc-700 rounded text-sm text-white placeholder-zinc-600 focus:border-rose-500 outline-none"
                                    value={state.backstoryType || ""}
                                    onChange={(e) => updateState('backstoryType', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Snippet (starts with verb)</label>
                                <input
                                    type="text"
                                    placeholder='e.g. witnessed the end of the world'
                                    className="w-full p-2 bg-[#121212] border border-zinc-700 rounded text-sm text-white placeholder-zinc-600 focus:border-rose-500 outline-none"
                                    value={state.customBackstorySnippet || ""}
                                    onChange={(e) => updateState('customBackstorySnippet', e.target.value)}
                                />
                            </div>
                        </div>
                     ) : (
                        <input
                            type="text"
                            placeholder={isMaxReached 
                              ? `Max limit of ${group.max} reached. Deselect items to add more.` 
                              : (group.multi ? `${group.customEx || "Type tag"} and press Enter...` : group.customEx || "Enter custom details...")
                            }
                            className={`w-full p-2 bg-[#121212] border border-zinc-700 rounded text-base md:text-sm text-white placeholder-zinc-500 focus:border-rose-500 outline-none
                              ${isMaxReached ? 'opacity-50 cursor-not-allowed text-zinc-500' : ''}
                            `}
                            disabled={isMaxReached}
                            value={!group.multi ? (typeof state[group.key] === 'string' ? state[group.key] : "") : (multiInputValues[group.key as string] || "")}
                            onChange={(e) => {
                                if (group.multi) {
                                    setMultiInputValues(prev => ({...prev, [group.key as string]: e.target.value}));
                                } else {
                                    updateState(group.key, e.target.value);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (group.multi && e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = multiInputValues[group.key as string] || "";
                                    handleCustomTagAdd(group.key as string, val, group.max);
                                    setMultiInputValues(prev => ({...prev, [group.key as string]: ""}));
                                }
                            }}
                        />
                     )}
                   </div>
                 )}
               </div>
             );
          })}
        </div>
      )}
    </div>
  );
};