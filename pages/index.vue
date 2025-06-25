<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
const { organization } = storeToRefs(userStore)

// Check if user is authenticated
const isAuthenticated = computed(() => userStore.isAuthenticated())

useSeoMeta({
  title: 'Roadflow AI - Automated Documentation & Content Generation',
  description: 'Transform your development workflow with AI-powered documentation generation. Connect your tools, configure webhooks, and automate content delivery to the right teams.'
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <UiImageWithFallback
          src="/roadflow.png"
          alt="Roadflow Logo"
          fallback-type="logo"
          image-class="h-10 w-auto object-contain"
          fallback-class="h-10 flex items-center justify-center"
          container-class="h-10 flex items-center"
          icon-size="w-8 h-8"
        />
        <div class="flex gap-3">
          <NuxtLink
            v-if="!isAuthenticated"
            to="/login"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Log In
          </NuxtLink>
          <NuxtLink
            v-else
            to="/dashboard"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            :to="isAuthenticated ? '/dashboard/workflows' : '/signup'"
            class="px-6 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
          >
            {{ isAuthenticated ? 'Manage Workflows' : 'Get Started' }}
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-6 py-20">
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
          Automate Your
          <span class="text-green-600">Documentation</span>
          Workflow
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Transform your development process with AI-powered documentation generation. Connect your tools, configure automated workflows, and deliver structured content to every team in your organization.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            :to="isAuthenticated ? '/dashboard/workflows' : '/signup'"
            class="px-8 py-4 text-lg font-semibold rounded-xl text-white bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {{ isAuthenticated ? 'Create Workflow' : 'Start Free Trial' }}
          </NuxtLink>
          <NuxtLink
            :to="isAuthenticated ? '/dashboard' : '/login'"
            class="px-8 py-4 text-lg font-semibold rounded-xl text-green-600 border-2 border-green-600 hover:bg-green-50 transition-all duration-200"
          >
            {{ isAuthenticated ? 'View Dashboard' : 'View Demo' }}
          </NuxtLink>
        </div>
      </div>

      <!-- Workflow Automation Process -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-20">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">How Roadflow Automates Your Workflow</h2>
        
        <!-- Step-by-step Process -->
        <div class="max-w-6xl mx-auto">
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <!-- Step 1: Trigger -->
            <div class="text-center">
              <div class="relative mb-6">
                <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="absolute -right-4 top-10 hidden md:block">
                  <svg class="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">1. Event Triggers</h3>
              <p class="text-gray-600 text-sm">
                Git commits, deployments, releases, or custom webhooks automatically trigger your workflows
              </p>
            </div>

            <!-- Step 2: AI Processing -->
            <div class="text-center">
              <div class="relative mb-6">
                <div class="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-green-200">
                  <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <rect x="5" y="7" width="14" height="12" rx="2"/>
                    <circle cx="9" cy="11" r="1" fill="currentColor"/>
                    <circle cx="15" cy="11" r="1" fill="currentColor"/>
                    <path d="M9 15h6"/>
                    <path d="M12 4v3"/>
                    <circle cx="12" cy="2" r="1" fill="currentColor"/>
                  </svg>
                </div>
                <div class="absolute -right-4 top-10 hidden md:block">
                  <svg class="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">2. AI Processing</h3>
              <p class="text-gray-600 text-sm">
                Smart agents analyze your code changes and generate relevant documentation using custom prompts
              </p>
            </div>

            <!-- Step 3: Distribution -->
            <div class="text-center">
              <div class="relative mb-6">
                <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">3. Smart Distribution</h3>
              <p class="text-gray-600 text-sm">
                Content is automatically formatted and delivered to the right teams through their preferred channels
              </p>
            </div>
          </div>

          <!-- Workflow Example -->
          <div class="bg-gray-50 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">Example Workflow in Action</h3>
            <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
              <!-- Git Event -->
              <div class="flex items-center bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">New Release</p>
                  <p class="text-sm text-gray-600">v2.1.0 deployed</p>
                </div>
              </div>

              <!-- Arrow -->
              <div class="hidden md:block">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>

              <!-- AI Processing -->
              <div class="flex items-center bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">AI Agent</p>
                  <p class="text-sm text-gray-600">Generates docs</p>
                </div>
              </div>

              <!-- Arrow -->
              <div class="hidden md:block">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>

              <!-- Team Notifications -->
              <div class="flex items-center bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Teams Notified</p>
                  <p class="text-sm text-gray-600">Product, Support, Sales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="max-w-7xl mx-auto px-6 py-20">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Powerful Workflow Automation</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Build intelligent workflows that automatically generate and distribute documentation when events occur in your development process.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <!-- Workflow Creation -->
        <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1-2H8l-1 2H5V5z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">Smart Workflows</h3>
          <p class="text-gray-600 mb-6">
            Create intelligent automation workflows with AI agents that understand your development context and generate relevant documentation.
          </p>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              AI-powered content generation
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Event-driven automation
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Custom prompts and agents
            </li>
          </ul>
        </div>

        <!-- Integration Hub -->
        <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
            </svg>
          </div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">Seamless Integration</h3>
          <p class="text-gray-600 mb-6">
            Connect with your existing development tools through webhooks and APIs. Trigger workflows on deployments, releases, tickets, and more.
          </p>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Git webhook triggers
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Team collaboration tools
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Multi-platform delivery
            </li>
          </ul>
        </div>

        <!-- Team Alignment -->
        <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">Perfect Team Alignment</h3>
          <p class="text-gray-600 mb-6">
            Ensure every team gets the right information in the right format. From technical specs for engineering to user guides for customer success.
          </p>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Role-based content delivery
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Always up-to-date information
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Structured knowledge base
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-green-600 py-20">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold text-white mb-6">
          Ready to Transform Your Documentation Workflow?
        </h2>
        <p class="text-xl text-green-100 mb-10">
          Join teams who have automated their documentation and improved cross-team alignment with Roadflow AI.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            :to="isAuthenticated ? '/dashboard/workflows' : '/signup'"
            class="px-8 py-4 text-lg font-semibold rounded-xl text-green-600 bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {{ isAuthenticated ? 'Create Workflow' : 'Start Your Free Trial' }}
          </NuxtLink>
          <NuxtLink
            :to="isAuthenticated ? '/dashboard' : '/login'"
            class="px-8 py-4 text-lg font-semibold rounded-xl text-white border-2 border-white hover:bg-green-500 transition-all duration-200"
          >
            {{ isAuthenticated ? 'Go to Dashboard' : 'Schedule Demo' }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 py-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center mb-4 md:mb-0">
            <UiImageWithFallback
              src="/roadflow.png"
              alt="Roadflow Logo"
              fallback-type="logo"
              image-class="h-8 w-auto object-contain"
              fallback-class="h-8 flex items-center justify-center"
              container-class="h-8 flex items-center mr-3"
              icon-size="w-6 h-6"
            />
            <span class="text-white text-lg font-semibold">Roadflow AI</span>
          </div>
          <p class="text-gray-400 text-sm">
            © 2024 Roadflow AI. Automate your documentation workflow.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
