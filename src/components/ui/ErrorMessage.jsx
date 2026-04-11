export const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 m-4 flex flex-col items-center justify-center">
    <svg className="w-8 h-8 mb-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <p className="font-medium">{message || 'Something went wrong!'}</p>
  </div>
);
