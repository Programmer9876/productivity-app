import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ref, get } from "firebase/database";
import { db, auth } from "@/firebase"; // adjust path if needed




export default function BarChartComponent() {
    const [data, setData] = useState<{ date: string; score: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          const user = auth.currentUser;
          if (!user) {
            return;
          }
            //get history
          const historyRef = ref(db, `users/${user.uid}/history`);
          const snapshot = await get(historyRef);
          //return if no snapshot
          if (!snapshot.exists())
            {
                return;               
            }
      
          const raw = snapshot.val();

      
          const now = new Date();
          //get 7 days ago
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 6); // include today
      
          const filtered = Object.entries(raw)
      .filter(([dateStr]) => {
        const parsed = new Date(dateStr);
        const keep = parsed >= sevenDaysAgo && parsed <= now;
        return keep;
      })
      .map(([dateStr, value]: any) => {
        const count = Object.keys(value).length;
        const label = formatDateLabel(dateStr);
        return { date: label, score: count };
      });
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());  
        setData(filtered);
    };
        fetchData();
      }, []);
      
  
    const formatDateLabel = (raw: string): string => {
      // "2025-05-18" → "May 18"
      const [year, month, day] = raw.split("-");
      const date = new Date(+year, +month - 1, +day);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} /> 
          <Tooltip />
          <Bar dataKey="score" fill="#4f46e5" name = "# of entries" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}