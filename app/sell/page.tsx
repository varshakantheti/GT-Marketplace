import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Listing - BuzzMarket',
};

export default function SellPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Create New Listing</h1>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price ($)</label>
              <input
                type="number"
                step="0.01"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2">
                <option>Electronics</option>
                <option>Furniture</option>
                <option>Books</option>
                <option>Clothing</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Condition</label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2">
                <option>New</option>
                <option>Like New</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2">
                <option>On Campus</option>
                <option>Off Campus</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Photos (up to 6)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
}

