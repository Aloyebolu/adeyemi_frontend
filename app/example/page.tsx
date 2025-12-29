import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog/dialog";

export default function TestDialog () {
  return (
    <Dialog>
      <DialogTrigger>Test Scrolling</DialogTrigger>
      
      <DialogContent>
        {/* Just render simple content that should scroll */}
        <div className="h-[200vh] bg-gradient-to-b from-blue-100 to-red-100 p-4">
          <h2>Test Content</h2>
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="p-2 border-b">Item {i + 1}</div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};