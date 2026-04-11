export const StatusBadge = ({ status }) => {
  let colorClasses = 'bg-gray-100 text-gray-800';
  
  if (status?.toLowerCase() === 'active' || status?.toLowerCase() === 'hired') {
    colorClasses = 'bg-green-100 text-green-800 border-green-200';
  } else if (status?.toLowerCase() === 'pending' || status?.toLowerCase() === 'in review') {
    colorClasses = 'bg-blue-100 text-blue-800 border-blue-200';
  } else if (status?.toLowerCase() === 'closed' || status?.toLowerCase() === 'rejected') {
    colorClasses = 'bg-red-100 text-red-800 border-red-200';
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}>
      {status}
    </span>
  );
};
