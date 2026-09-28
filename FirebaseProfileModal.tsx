import React, { useState, useEffect } from 'react';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import { X, LogIn, LogOut, Database, User, Shield, Bookmark, Trash2, Cpu, Check } from 'lucide-react';

interface FirebaseProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSession: (synthesizedText: string) => void;
}

interface SavedSession {
  id: string;
  title: string;
  synthesizedText: string;
  npuLatencyMs?: number;
  topsUtilized?: number;
  powerWatts?: number;
  thermalCelsius?: number;
  createdAt?: any;
}

export const FirebaseProfileModal: React.FC<FirebaseProfileModalProps> = ({
  isOpen,
  onClose,
  onLoadSession,
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<{
    targetDevice?: string;
    preferredNpuMode?: string;
  }>({
    targetDevice: 'Snapdragon X Elite',
    preferredNpuMode: 'high_performance',
  });
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch User profile from Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            setUserProfile({
              targetDevice: data.targetDevice || 'Snapdragon X Elite',
              preferredNpuMode: data.preferredNpuMode || 'high_performance',
            });
          } else {
            // First time login - initialize user record
            await setDoc(userDocRef, {
              uid: user.uid,
              email: user.email || 'user@example.com',
              displayName: user.displayName || 'Snapdragon Developer',
              photoURL: user.photoURL || '',
              targetDevice: 'Snapdragon X Elite',
              preferredNpuMode: 'high_performance',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }

        // Listen to saved sessions
        try {
          const sessionsCol = collection(db, 'users', user.uid, 'sessions');
          const q = query(sessionsCol, orderBy('createdAt', 'desc'));
          const unsubscribeSessions = onSnapshot(
            q,
            (snapshot) => {
              const items: SavedSession[] = [];
              snapshot.forEach((d) => {
                items.push(d.data() as SavedSession);
              });
              setSavedSessions(items);
            },
            (error) => {
              handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/sessions`);
            }
          );
          return () => unsubscribeSessions();
        } catch (err) {
          console.error('Error attaching sessions snapshot:', err);
        }
      } else {
        setSavedSessions([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setStatusMsg('Successfully authenticated with Google.');
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setStatusMsg(`Authentication failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setStatusMsg('Signed out.');
    } catch (err: any) {
      console.error('Sign-out error:', err);
    }
  };

  const handleUpdatePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userDocRef,
        {
          targetDevice: userProfile.targetDevice,
          preferredNpuMode: userProfile.preferredNpuMode,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setStatusMsg('Preferences synced to Firestore.');
      setTimeout(() => setStatusMsg(null), 2500);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.uid}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'sessions', sessionId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${currentUser.uid}/sessions/${sessionId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0a0e17] border border-[#00e5ff]/30 rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(0,229,255,0.25)] flex flex-col gap-4 font-mono max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#00e5ff]" />
            <h3 className="font-['Space_Grotesk'] text-[16px] font-bold text-white">
              Firebase Auth & Firestore Cloud
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#181b25] hover:bg-[#262a34] text-[#bac9cc] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Database Connection Attestation Badge */}
        <div className="bg-[#181b25] p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00e676] shadow-[0_0_6px_rgba(5,231,119,0.8)]"></span>
            <span className="text-[#dfe2ef]">Project: centered-motif-427713-q2</span>
          </div>
          <span className="text-[#7dffa2] bg-[#00e676]/10 px-2 py-0.5 rounded text-[9px] font-bold">
            FIRESTORE CONNECTED
          </span>
        </div>

        {/* Auth Section */}
        {!currentUser ? (
          <div className="bg-[#1c1f29] p-4 rounded-xl border border-white/5 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#00e5ff]/15 flex items-center justify-center text-[#00e5ff]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-['Space_Grotesk'] text-[15px] font-bold text-white">
                Secure On-Device Cloud Sync
              </h4>
              <p className="text-[11px] text-[#849396] font-['Sora'] mt-1">
                Sign in with your Google Account to persist assistive telemetry snapshots, save SLM notes, and synchronize customized Hexagon HTP profiles.
              </p>
            </div>
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#00e5ff] hover:bg-[#9cf0ff] text-[#00363d] font-bold text-[12px] flex items-center gap-2 transition-all shadow-[0_0_12px_rgba(0,229,255,0.4)] cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign in with Google'}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* User Profile Card */}
            <div className="bg-[#1c1f29] p-3 rounded-xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Avatar'}
                    className="w-10 h-10 rounded-full border border-[#00e5ff]/50"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#00e5ff]/20 flex items-center justify-center text-[#00e5ff]">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="text-[13px] font-bold text-white">{currentUser.displayName || 'Developer'}</div>
                  <div className="text-[10px] text-[#849396]">{currentUser.email}</div>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="px-2.5 py-1 rounded bg-[#262a34] hover:bg-[#353943] text-[#ffb4ab] text-[10px] flex items-center gap-1 border border-white/5 transition-all cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Target Hardware Preferences Form */}
            <form onSubmit={handleUpdatePreferences} className="bg-[#181b25] p-3 rounded-xl border border-white/5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] text-[#00e5ff] font-bold">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Hardware & NPU Preferences</span>
                </span>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-2.5 py-0.5 rounded bg-[#00e5ff] hover:bg-[#9cf0ff] text-[#00363d] font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>Save</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <label className="text-[#849396] block mb-0.5">Target SoC:</label>
                  <input
                    type="text"
                    value={userProfile.targetDevice}
                    onChange={(e) => setUserProfile({ ...userProfile, targetDevice: e.target.value })}
                    className="w-full bg-[#0a0e17] text-white rounded p-1.5 border border-white/10 text-[10px] focus:outline-none focus:border-[#00e5ff]"
                  />
                </div>
                <div>
                  <label className="text-[#849396] block mb-0.5">HTP Power Mode:</label>
                  <select
                    value={userProfile.preferredNpuMode}
                    onChange={(e) => setUserProfile({ ...userProfile, preferredNpuMode: e.target.value })}
                    className="w-full bg-[#0a0e17] text-[#7dffa2] rounded p-1.5 border border-white/10 text-[10px] focus:outline-none focus:border-[#00e5ff]"
                  >
                    <option value="high_performance">high_performance (Burst)</option>
                    <option value="balanced">balanced (35W)</option>
                    <option value="power_saver">power_saver (4.2W)</option>
                  </select>
                </div>
              </div>
            </form>

            {/* Saved Sessions in Firestore */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#849396] flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-[#7dffa2]" />
                  <span>Saved Sessions ({savedSessions.length})</span>
                </span>
                <span className="text-[9px] text-[#849396]">PATH: /users/{currentUser.uid.slice(0, 6)}.../sessions</span>
              </div>

              <div className="max-h-48 overflow-y-auto flex flex-col gap-1.5">
                {savedSessions.length === 0 ? (
                  <div className="bg-[#181b25] p-3 rounded-lg text-center text-[#849396] text-[11px] italic">
                    No sessions saved yet. Click "Save to DB" on any Gemini response or HUD synthesized note!
                  </div>
                ) : (
                  savedSessions.map((s) => (
                    <div
                      key={s.id}
                      className="bg-[#181b25] p-2 rounded-lg border border-white/5 flex items-start justify-between gap-2 text-[10px]"
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-semibold text-white truncate">{s.title}</span>
                        <p className="text-[#bac9cc] truncate font-['Sora'] mt-0.5">{s.synthesizedText}</p>
                        <div className="flex items-center gap-2 text-[8px] text-[#7dffa2] mt-1">
                          <span>{s.npuLatencyMs}ms NPU</span>
                          <span>{s.topsUtilized} TOPS</span>
                          <span>{s.powerWatts}W</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            onLoadSession(s.synthesizedText);
                            onClose();
                          }}
                          className="px-2 py-1 rounded bg-[#00e5ff]/20 text-[#00e5ff] hover:bg-[#00e5ff]/30 cursor-pointer"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDeleteSession(s.id)}
                          className="p-1 rounded bg-transparent hover:bg-[#ff5252]/20 text-[#ffb4ab] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {statusMsg && (
          <div className="p-2 rounded bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] text-[10px] text-center">
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
};
