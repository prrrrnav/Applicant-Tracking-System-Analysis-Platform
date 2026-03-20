import { motion } from "framer-motion";

export default function Loader({ label = "Analyzing..." }) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-indigo-600"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
      />
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  );
}

