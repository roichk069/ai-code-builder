export interface Template {
  id: string;
  name: string;
  description: string;
  files: Record<string, string>;
}

export const templates: Template[] = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Modern landing page with hero section, features, and CTA',
    files: {
      '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Landing Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
    <nav class="container mx-auto px-6 py-6 flex justify-between items-center">
        <div class="text-2xl font-bold">YourBrand</div>
        <div class="space-x-6">
            <a href="#features" class="hover:text-purple-300">Features</a>
            <a href="#pricing" class="hover:text-purple-300">Pricing</a>
            <a href="#contact" class="hover:text-purple-300">Contact</a>
        </div>
    </nav>

    <section class="container mx-auto px-6 py-24 text-center">
        <h1 class="text-6xl font-bold mb-6">Build Something Amazing</h1>
        <p class="text-xl mb-12 text-purple-200">The ultimate platform to bring your ideas to life</p>
        <button class="bg-white text-purple-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-100 transition">
            Get Started Free
        </button>
    </section>

    <section id="features" class="container mx-auto px-6 py-24">
        <h2 class="text-4xl font-bold text-center mb-16">Features</h2>
        <div class="grid md:grid-cols-3 gap-12">
            <div class="text-center">
                <div class="text-5xl mb-4">⚡</div>
                <h3 class="text-2xl font-bold mb-4">Lightning Fast</h3>
                <p class="text-purple-200">Blazing fast performance for the best user experience</p>
            </div>
            <div class="text-center">
                <div class="text-5xl mb-4">🔒</div>
                <h3 class="text-2xl font-bold mb-4">Secure</h3>
                <p class="text-purple-200">Enterprise-grade security to keep your data safe</p>
            </div>
            <div class="text-center">
                <div class="text-5xl mb-4">🎨</div>
                <h3 class="text-2xl font-bold mb-4">Beautiful</h3>
                <p class="text-purple-200">Stunning design that your users will love</p>
            </div>
        </div>
    </section>

    <section class="container mx-auto px-6 py-24 text-center">
        <h2 class="text-4xl font-bold mb-6">Ready to get started?</h2>
        <p class="text-xl mb-12 text-purple-200">Join thousands of happy customers</p>
        <button class="bg-white text-purple-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-100 transition">
            Start Your Free Trial
        </button>
    </section>
</body>
</html>`,
    },
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Clean blog layout with posts and sidebar',
    files: {
      '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Blog</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <nav class="bg-white shadow-sm">
        <div class="container mx-auto px-6 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold text-gray-800">My Blog</h1>
                <div class="space-x-6">
                    <a href="#" class="text-gray-600 hover:text-gray-900">Home</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">Contact</a>
                </div>
            </div>
        </div>
    </nav>

    <div class="container mx-auto px-6 py-12">
        <div class="grid md:grid-cols-3 gap-8">
            <div class="md:col-span-2 space-y-8">
                <article class="bg-white rounded-lg shadow-md overflow-hidden">
                    <img src="https://via.placeholder.com/800x400" alt="Post" class="w-full">
                    <div class="p-6">
                        <div class="text-sm text-gray-500 mb-2">June 1, 2024</div>
                        <h2 class="text-3xl font-bold mb-4">Getting Started with Web Development</h2>
                        <p class="text-gray-700 mb-4">
                            Learn the fundamentals of web development and build your first website. 
                            This comprehensive guide will walk you through HTML, CSS, and JavaScript basics.
                        </p>
                        <a href="#" class="text-blue-600 hover:text-blue-800 font-semibold">Read More →</a>
                    </div>
                </article>

                <article class="bg-white rounded-lg shadow-md overflow-hidden">
                    <img src="https://via.placeholder.com/800x400" alt="Post" class="w-full">
                    <div class="p-6">
                        <div class="text-sm text-gray-500 mb-2">May 28, 2024</div>
                        <h2 class="text-3xl font-bold mb-4">10 Design Tips for Beginners</h2>
                        <p class="text-gray-700 mb-4">
                            Master the art of web design with these essential tips that will help 
                            you create beautiful and functional websites.
                        </p>
                        <a href="#" class="text-blue-600 hover:text-blue-800 font-semibold">Read More →</a>
                    </div>
                </article>
            </div>

            <aside>
                <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 class="text-xl font-bold mb-4">About Me</h3>
                    <p class="text-gray-700">
                        Hi! I'm a web developer passionate about creating amazing digital experiences.
                    </p>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-xl font-bold mb-4">Categories</h3>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-600 hover:text-gray-900">Web Development</a></li>
                        <li><a href="#" class="text-gray-600 hover:text-gray-900">Design</a></li>
                        <li><a href="#" class="text-gray-600 hover:text-gray-900">JavaScript</a></li>
                        <li><a href="#" class="text-gray-600 hover:text-gray-900">Tutorials</a></li>
                    </ul>
                </div>
            </aside>
        </div>
    </div>
</body>
</html>`,
    },
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Admin dashboard with charts and statistics',
    files: {
      '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="flex h-screen">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-900 text-white">
            <div class="p-6">
                <h1 class="text-2xl font-bold">Dashboard</h1>
            </div>
            <nav class="mt-6">
                <a href="#" class="block px-6 py-3 bg-gray-800">Overview</a>
                <a href="#" class="block px-6 py-3 hover:bg-gray-800">Analytics</a>
                <a href="#" class="block px-6 py-3 hover:bg-gray-800">Users</a>
                <a href="#" class="block px-6 py-3 hover:bg-gray-800">Settings</a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto">
            <header class="bg-white shadow-sm">
                <div class="px-8 py-4">
                    <h2 class="text-2xl font-bold text-gray-800">Overview</h2>
                </div>
            </header>

            <div class="p-8">
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="text-sm text-gray-500">Total Users</div>
                        <div class="text-3xl font-bold text-gray-900 mt-2">12,543</div>
                        <div class="text-sm text-green-600 mt-2">↑ 12% from last month</div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="text-sm text-gray-500">Revenue</div>
                        <div class="text-3xl font-bold text-gray-900 mt-2">$54,231</div>
                        <div class="text-sm text-green-600 mt-2">↑ 8% from last month</div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="text-sm text-gray-500">Active Projects</div>
                        <div class="text-3xl font-bold text-gray-900 mt-2">48</div>
                        <div class="text-sm text-gray-600 mt-2">→ No change</div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="text-sm text-gray-500">Conversion Rate</div>
                        <div class="text-3xl font-bold text-gray-900 mt-2">3.24%</div>
                        <div class="text-sm text-red-600 mt-2">↓ 2% from last month</div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-xl font-bold mb-4">Recent Activity</h3>
                    <table class="w-full">
                        <thead>
                            <tr class="text-left border-b">
                                <th class="pb-3">User</th>
                                <th class="pb-3">Action</th>
                                <th class="pb-3">Date</th>
                                <th class="pb-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b">
                                <td class="py-3">John Doe</td>
                                <td class="py-3">Created new project</td>
                                <td class="py-3">2 hours ago</td>
                                <td class="py-3"><span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Success</span></td>
                            </tr>
                            <tr class="border-b">
                                <td class="py-3">Jane Smith</td>
                                <td class="py-3">Updated profile</td>
                                <td class="py-3">5 hours ago</td>
                                <td class="py-3"><span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Success</span></td>
                            </tr>
                            <tr class="border-b">
                                <td class="py-3">Bob Johnson</td>
                                <td class="py-3">Deleted item</td>
                                <td class="py-3">1 day ago</td>
                                <td class="py-3"><span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">Deleted</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
</body>
</html>`,
    },
  },
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start from scratch with a blank HTML page',
    files: {
      '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="container mx-auto px-6 py-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Hello World!</h1>
        <p class="text-gray-600">Start building something amazing...</p>
    </div>
</body>
</html>`,
    },
  },
];
