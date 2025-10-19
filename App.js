import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  StyleSheet, 
  FlatList 
} from "react-native";
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  runTransaction 
} from "firebase/firestore";

// --- Config ---
const appId = "default-app-id"; // You can rename if needed
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
};
const initialAuthToken = null;

const TEAM_IDS = Array.from({ length: 8 }, (_, i) => i + 1);
const INITIAL_TEAM_BALANCE = 0;

export default function App() {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [teamId, setTeamId] = useState(1);
  const [balance, setBalance] = useState(INITIAL_TEAM_BALANCE);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  // ✅ Fixed amount input for mobile
  const handleAmountChange = (text) => {
    if (text === "") {
      setTransactionAmount("");
      return;
    }
    if (/^\d*\.?\d*$/.test(text)) {
      if (text.length > 1 && text.startsWith("0") && !text.startsWith("0.")) {
        text = text.replace(/^0+/, "");
      }
      setTransactionAmount(text);
    }
  };

  // --- Firebase Initialization (with logging & error catching) ---
  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const authInstance = getAuth(app);
      setDb(firestore);
      setAuth(authInstance);

      console.log("✅ Firebase initialized successfully");

      const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
        if (user) {
          console.log("👤 Authenticated as:", user.uid);
          setUserId(user.uid);
          setLoading(false);
        } else {
          try {
            if (initialAuthToken) {
              await signInWithCustomToken(authInstance, initialAuthToken);
            } else {
              await signInAnonymously(authInstance);
            }
          } catch (error) {
            console.error("❌ Auth Error:", error);
            Alert.alert("Authentication Error", error.message);
            setLoading(false);
          }
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("🔥 Firebase init error:", error);
      Alert.alert("Firebase Error", error.message);
    }
  }, []);

  // --- Firestore document reference ---
  const balanceDocRef = useMemo(() => {
    if (db && teamId) {
      return doc(db, "artifacts", appId, "public", "data", "team_balances", `team_${teamId}`);
    }
    return null;
  }, [db, teamId]);

  // --- Real-time listener ---
  useEffect(() => {
    setLoading(true);
    setBalance(0);

    if (db && userId && balanceDocRef) {
      const initializeBalance = async () => {
        try {
          const docSnap = await getDoc(balanceDocRef);
          if (!docSnap.exists()) {
            await setDoc(balanceDocRef, { balance: INITIAL_TEAM_BALANCE });
          }
        } catch (error) {
          console.error("🔥 Error initializing balance:", error);
        }
      };

      initializeBalance();

      const unsubscribe = onSnapshot(balanceDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBalance(typeof data.balance === "number" ? data.balance : 0);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [db, userId, balanceDocRef, teamId]);

  // --- Transaction handler ---
  const handleTransaction = useCallback(
    async (type) => {
      if (!db || !balanceDocRef || loading) return;

      const amount = parseFloat(transactionAmount);
      if (isNaN(amount) || amount <= 0) {
        Alert.alert("Invalid Input", "Please enter a valid amount greater than 0.");
        return;
      }

      try {
        await runTransaction(db, async (transaction) => {
          const docSnapshot = await transaction.get(balanceDocRef);
          const currentBalance = docSnapshot.exists()
            ? docSnapshot.data().balance
            : INITIAL_TEAM_BALANCE;

          const newBalance = type === "add" ? currentBalance + amount : currentBalance - amount;

          transaction.set(balanceDocRef, {
            balance: newBalance,
            lastUpdated: new Date().toISOString(),
          });
        });

        setStatusMessage(`${type === "add" ? "Added" : "Deducted"} $${amount.toFixed(2)} successfully.`);
        setTransactionAmount("");
      } catch (error) {
        console.error("🔥 Transaction Error:", error);
        Alert.alert("Transaction Error", error.message);
      }
    },
    [db, balanceDocRef, transactionAmount, loading]
  );

  // --- Loading screen ---
  if (loading && !userId) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ marginTop: 10, color: "#4f46e5" }}>Connecting to Firebase...</Text>
      </View>
    );
  }

  // --- UI ---
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏦 Monopoly Team Bank</Text>
      <Text style={styles.subtitle}>Manage funds for Teams 1–8</Text>

      {/* Team Selector */}
      <FlatList
        horizontal
        data={TEAM_IDS}
        keyExtractor={(id) => id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setTeamId(item)}
            style={[styles.teamButton, teamId === item && styles.teamButtonActive]}
          >
            <Text style={[styles.teamButtonText, teamId === item && styles.teamButtonTextActive]}>
              Team {item}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ marginVertical: 15 }}
        showsHorizontalScrollIndicator={false}
      />

      {/* Balance */}
      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>Team {teamId} Balance</Text>
        <Text style={[styles.balanceValue, balance >= 0 ? styles.positive : styles.negative]}>
          ${balance.toFixed(2)}
        </Text>
      </View>

      {/* Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter amount (e.g., 500 or 12.50)"
        value={transactionAmount}
        onChangeText={handleAmountChange}
        keyboardType="numeric"
      />

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() => handleTransaction("add")}
          style={[styles.actionButton, { backgroundColor: "#10b981" }]}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTransaction("deduct")}
          style={[styles.actionButton, { backgroundColor: "#ef4444" }]}
        >
          <Text style={styles.buttonText}>Deduct</Text>
        </TouchableOpacity>
      </View>

      {/* Status Message */}
      {statusMessage && <Text style={styles.status}>{statusMessage}</Text>}

      <Text style={styles.footer}>Synced with Firebase Firestore</Text>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#4f46e5",
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 20,
  },
  teamButton: {
    padding: 10,
    marginHorizontal: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
  },
  teamButtonActive: {
    backgroundColor: "#4f46e5",
  },
  teamButtonText: {
    fontWeight: "600",
    color: "#374151",
  },
  teamButtonTextActive: {
    color: "#fff",
  },
  balanceBox: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#6b7280",
  },
  balanceValue: {
    fontSize: 40,
    fontWeight: "800",
    marginTop: 5,
  },
  positive: { color: "#10b981" },
  negative: { color: "#ef4444" },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  status: {
    textAlign: "center",
    color: "#059669",
    fontWeight: "600",
    marginTop: 10,
  },
  footer: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 30,
    fontSize: 12,
  },
});
