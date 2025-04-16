export default function Textarea({ ...props }) {
  return (
    <textarea
      {...props}
      className="block p-2.5 w-full text-gray-500  rounded-lg border border-gray-200 focus:ring-blue-500 focus:border-blue-500 "
      placeholder="Your message..."
    ></textarea>
  );
}
