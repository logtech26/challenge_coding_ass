import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

const transactions = [
  { customer: "John", amount: 120, date: "2026-01-10" },
  { customer: "John", amount: 80, date: "2026-02-15" },
  { customer: "John", amount: 150, date: "2026-03-20" },
  { customer: "Mary", amount: 100, date: "2026-01-12" },
  { customer: "Mary", amount: 200, date: "2026-02-18" },
  { customer: "Mary", amount: 75, date: "2026-03-05" },
  { customer: "Alice", amount: 50, date: "2026-01-25" },
  { customer: "Alice", amount: 120, date: "2026-02-10" },
  { customer: "Alice", amount: 90, date: "2026-03-15" },
  { customer: "Bob", amount: 200, date: "2026-01-05" },
  { customer: "Bob", amount: 150, date: "2026-02-20" },
  { customer: "Bob", amount: 80, date: "2026-03-25" },
  
];

// api simulation function to fetch transactions
export function fetchTransactions() {
  
  return new Promise((resolve) => { 
        setTimeout(() => {
      resolve(transactions);
    }, 1000); // Simulate a 1-second delay
  });
}


// Award point calculation
const calculateAwardedPoints = amt =>
       Math.max(0, Math.floor(amt) - 100) * 2 + Math.max(0, Math.min(Math.floor(amt), 100) - 50);


function App() {
 const [rewards, setRewards] = useState({});
 const[error, setError] = useState(null);
 const [loading, setLoading] = useState(true);



useEffect(() => {
  fetchTransactions().then(data => {
    const result = data.reduce((acc, {customer, amount, date}) => {
      const month = date.slice(0,7);
      const points = calculateAwardedPoints(amount);

      acc[customer] ??= {total: 0};
      acc[customer][month] = (acc[customer][month] || 0) + points;
      acc[customer].total += points;
      

      return acc;

    }, {});

    setRewards(result);
    setLoading(false);
    setError(null);
  }).catch(err => {
    setError("Failed to fetch transactions.");
    setLoading(false);
  });

},[]);

 
  return (
    <>
  <Navbar/>
   <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/20 rounded-2xl p-10 m-10 shadow-xl backdrop-blur-md">
          <h2 className="text-base font-semibold text-indigo-300 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Rewards Calculation Policy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300 mt-3">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="block font-medium text-indigo-400 mb-1">Under $50</span>
              Earns <strong className="text-white">0 points</strong> per dollar spent.
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="block font-medium text-indigo-400 mb-1">$50 to $100</span>
              Earns <strong className="text-white">1 point</strong> for every dollar between $50 and $100.
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="block font-medium text-indigo-400 mb-1">Over $100</span>
              Earns <strong className="text-white">2 points</strong> for every dollar over $100, plus 50 points for the $50-$100 tier.
            </div>
          </div>
        </div>
  {loading ? (
    <div className="flex justify-center items-center h-screen">
      <div className="text-indigo-400 text-lg font-semibold">Loading transactions...</div>
    </div>
  ) : error ? (
    <div className="flex justify-center items-center h-screen">
      <div className="text-red-500 text-lg font-semibold" aria-live="polite">
        {error}
      </div>
    </div>
  ) : (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Rewards Summary</h1>
        {Object.keys(rewards).length === 0 ? (
          <p className="text-gray-600">No transactions available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Customer</th>
                  {Object.keys(rewards[Object.keys(rewards)[0]]).filter(key => key !== 'total').map(month => (
                    <th key={month} className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">{month}</th>
                  ))}
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Total Points</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(rewards).map(([customer, months]) => (
                  <tr key={customer} className="border-t border-gray-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer}</td>
                    {Object.keys(months).filter(key => key !== 'total').map(month => (
                      <td key={month} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{months[month]}</td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{months.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )}

    </>
  );
}

export default App;
