import FileUpload from "./Cloud";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Upload & Preview Files</h1>
      <FileUpload />
    </div>
  );
}
