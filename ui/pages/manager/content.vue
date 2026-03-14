<template>
  <div class="min-h-full bg-palette-cream/40 font-poppins">
    <header class="bg-palette-white border-b border-palette-olive/15 shadow-sm">
      <div class="px-6 lg:px-8 py-6 sm:py-8">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
        <h1 class="font-heading text-2xl sm:text-3xl font-bold text-palette-brown">Site Content</h1>
        <p class="mt-1 text-sm text-palette-brown/70 max-w-xl">
              Edit text, images, and settings for each section. Use the preview in each section to see changes before saving. Save to apply to the live site.
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary shrink-0 inline-flex items-center gap-2"
          >
            Open site in new tab
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      </div>
    </header>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Sticky tab navigation: compact single row on mobile (no scroll), normal on desktop -->
      <nav
        class="sticky top-14 md:top-0 z-10 -mx-4 px-2 py-1.5 sm:mx-0 sm:px-0 sm:py-3 bg-palette-cream/95 backdrop-blur-md border-b border-palette-olive/20 mb-6 rounded-b-xl sm:rounded-none shadow-sm sm:shadow-none"
        aria-label="Content sections"
      >
        <div class="flex min-h-[36px] sm:min-h-[44px] items-stretch gap-1 sm:gap-2 sm:justify-center">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="content-tab-btn flex-1 min-w-0 px-1.5 py-1.5 sm:flex-none sm:min-w-0 sm:px-4 sm:py-2.5 rounded-md sm:rounded-lg text-[10px] sm:text-sm font-medium truncate sm:whitespace-nowrap focus:outline-none"
            :class="activeTab === tab.id
              ? 'bg-palette-sage text-white'
              : 'text-palette-brown/80 hover:bg-palette-olive/15 hover:text-palette-brown'"
            :title="tab.label"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
      </nav>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-3">
        <svg class="h-8 w-8 animate-spin text-palette-sage" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span class="text-palette-brown/70 text-sm">Loading content…</span>
      </div>

      <!-- Form content in card -->
      <template v-else>
        <!-- About Us -->
        <form
          v-show="activeTab === 'about'"
          class="content-form"
          @submit.prevent="saveSection('about', aboutForm)"
        >
          <div class="content-card">
            <h2 class="content-heading">About Us</h2>
            <p class="content-sub">Main story and image shown on the About section.</p>

            <!-- Texts: content, font style, color -->
            <section class="content-section">
              <h3 class="content-section-title">Texts</h3>
              <p class="text-sm text-palette-brown/70 mb-4">Customize the headline and body: content, font style, and color.</p>
              <div class="form-field">
                <label class="form-label">Title</label>
                <input v-model="aboutForm.title" type="text" class="form-input" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-field">
                  <label class="form-label">Title font</label>
                  <select v-model="aboutForm.titleFontFamily" class="form-input">
                    <option v-for="f in aboutFontOptions" :key="f.value" :value="f.value">{{ f.label }}</option>
                  </select>
                </div>
                <div class="form-field">
                  <label class="form-label">Title color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(aboutForm.titleColor, '#7B7557')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="aboutForm.titleColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="aboutForm.titleColor" type="text" class="form-input flex-1 min-w-0" placeholder="#7B7557" />
                  </div>
                </div>
              </div>
              <div class="form-field mt-4">
                <label class="form-label">Paragraphs</label>
                <p class="form-hint">One paragraph per line.</p>
                <textarea v-model="aboutParagraphsText" rows="5" class="form-input" placeholder="First paragraph…" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="form-field">
                  <label class="form-label">Body font</label>
                  <select v-model="aboutForm.textFontFamily" class="form-input">
                    <option v-for="f in aboutFontOptions" :key="f.value" :value="f.value">{{ f.label }}</option>
                  </select>
                </div>
                <div class="form-field">
                  <label class="form-label">Body text color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(aboutForm.textColor, '#1E1E1E')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="aboutForm.textColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="aboutForm.textColor" type="text" class="form-input flex-1 min-w-0" placeholder="#1E1E1E" />
                  </div>
                </div>
              </div>
            </section>

            <section class="content-section">
              <h3 class="content-section-title">Image</h3>
              <div class="form-field">
                <label class="form-label">Main image</label>
                <AdminImageUpload v-model="aboutForm.image" />
              </div>
              <div class="form-field">
                <label class="form-label">Image alt text (accessibility)</label>
                <input v-model="aboutForm.imageAlt" type="text" class="form-input" placeholder="Describe the image" />
              </div>
              <div class="form-field">
                <label class="form-label">Overlay text on image</label>
                <input v-model="aboutForm.overlayText" type="text" class="form-input" />
              </div>
            </section>

            <!-- Button -->
            <section class="content-section">
              <h3 class="content-section-title">Button</h3>
              <p class="text-sm text-palette-brown/70 mb-4">Customize the “Learn more” button: label, font, and colors.</p>
              <div class="form-field">
                <label class="form-label">Button label</label>
                <input v-model="aboutForm.button.text" type="text" class="form-input" />
              </div>
              <div class="form-field">
                <label class="form-label">Button font</label>
                <select v-model="aboutForm.buttonFontFamily" class="form-input">
                  <option v-for="f in aboutFontOptions" :key="f.value" :value="f.value">{{ f.label }}</option>
                </select>
              </div>
              <div class="form-field">
                <label class="form-label">Button style</label>
                <div class="flex flex-wrap gap-3">
                  <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input v-model="aboutForm.buttonStyle" type="radio" value="solid" class="rounded border-palette-olive/30" />
                    <span class="text-sm">Solid</span>
                  </label>
                  <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input v-model="aboutForm.buttonStyle" type="radio" value="gradient" class="rounded border-palette-olive/30" />
                    <span class="text-sm">Gradient</span>
                  </label>
                </div>
              </div>
              <template v-if="aboutForm.buttonStyle === 'solid'">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="form-field">
                  <label class="form-label">Button color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(aboutForm.buttonColor, '#7B7557')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="aboutForm.buttonColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="aboutForm.buttonColor" type="text" class="form-input flex-1 min-w-0" placeholder="#7B7557" />
                  </div>
                </div>
                <div class="form-field">
                  <label class="form-label">Button text color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(aboutForm.buttonTextColor, '#ffffff')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="aboutForm.buttonTextColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="aboutForm.buttonTextColor" type="text" class="form-input flex-1 min-w-0" placeholder="#ffffff" />
                  </div>
                </div>
                <div class="form-field">
                  <label class="form-label">Button hover color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(aboutForm.buttonHoverColor, '#605B45')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="aboutForm.buttonHoverColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="aboutForm.buttonHoverColor" type="text" class="form-input flex-1 min-w-0" placeholder="#605B45" />
                  </div>
                </div>
              </div>
              </template>
              <template v-else>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="form-field">
                    <label class="form-label">Gradient color 1</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(aboutForm.buttonGradientColor1, '#7B7557')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="aboutForm.buttonGradientColor1 = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="aboutForm.buttonGradientColor1" type="text" class="form-input flex-1 min-w-0" placeholder="#7B7557" />
                    </div>
                </div>
                <div class="form-field">
                    <label class="form-label">Gradient color 2</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(aboutForm.buttonGradientColor2, '#605B45')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="aboutForm.buttonGradientColor2 = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="aboutForm.buttonGradientColor2" type="text" class="form-input flex-1 min-w-0" placeholder="#605B45" />
                </div>
              </div>
                </div>
                <div class="form-field">
                  <label class="form-label">Gradient direction</label>
                  <select v-model="aboutForm.buttonGradientDirection" class="form-input">
                    <option v-for="d in heroGradientDirections" :key="d.value" :value="d.value">{{ d.label }}</option>
                  </select>
                </div>
                <div class="form-field">
                  <label class="form-label">Button text color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(aboutForm.buttonTextColor, '#ffffff')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="aboutForm.buttonTextColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="aboutForm.buttonTextColor" type="text" class="form-input flex-1 min-w-0" placeholder="#ffffff" />
                  </div>
                </div>
              </template>
            </section>

            <section class="content-section border-t border-palette-olive/15 pt-6">
              <h3 class="content-section-title">Full section preview</h3>
              <p class="text-sm text-palette-brown/70 mb-4">Preview the whole About section with your current edits. Use Reset to discard unsaved changes.</p>
              <div class="rounded-xl border-2 border-palette-olive/25 overflow-hidden bg-white shadow-inner">
                <div class="grid md:grid-cols-2 gap-4 p-4 md:p-6 min-h-0">
                  <div class="text-center md:text-left">
                    <h3
                      class="text-xl md:text-2xl font-bold mb-3"
                      :style="{ fontFamily: aboutForm.titleFontFamily || 'Poppins', color: aboutForm.titleColor || '#7B7557' }"
                    >{{ aboutForm.title || 'About us' }}</h3>
                    <p
                      class="text-sm leading-relaxed mb-2"
                      :style="{ fontFamily: aboutForm.textFontFamily || 'Poppins', color: aboutForm.textColor || '#1E1E1E' }"
                    >{{ (aboutForm.paragraphs && aboutForm.paragraphs[0]) || 'First paragraph…' }}</p>
                    <p
                      v-if="aboutForm.paragraphs && aboutForm.paragraphs[1]"
                      class="text-sm leading-relaxed mb-4 line-clamp-2"
                      :style="{ fontFamily: aboutForm.textFontFamily || 'Poppins', color: aboutForm.textColor || '#1E1E1E' }"
                    >{{ aboutForm.paragraphs[1] }}</p>
                    <p v-else class="mb-4" />
                    <span
                      class="inline-flex text-xs font-bold px-4 py-2 rounded-full uppercase"
                      :style="aboutPreviewButtonStyle"
                    >{{ aboutForm.button?.text || 'LEARN MORE' }}</span>
                  </div>
                  <div class="relative rounded-lg overflow-hidden bg-palette-olive/10 min-h-[160px]">
                    <img
                      v-if="aboutForm.image"
                      :src="aboutForm.image"
                      :alt="aboutForm.imageAlt"
                      class="w-full h-full object-cover min-h-[160px]"
                    />
                    <div v-else class="absolute inset-0 flex items-center justify-center text-palette-brown/40 text-sm">No image</div>
                    <div
                      v-if="aboutForm.overlayText"
                      class="absolute bottom-3 left-3 bg-white/90 px-3 py-1.5 rounded-full text-sm font-bold"
                      style="color: #69AC7C"
                    >{{ aboutForm.overlayText }}</div>
                  </div>
                </div>
              </div>
            </section>

            <div class="form-actions flex flex-wrap items-center gap-3">
              <button type="submit" class="btn-primary">Save About Us</button>
              <button type="button" class="btn-secondary" @click="resetContent">Reset</button>
            </div>
          </div>
        </form>

        <!-- Our Space -->
        <form v-show="activeTab === 'ourSpace'" class="content-form" @submit.prevent="saveSection('ourSpace', ourSpaceForm)">
          <div class="content-card">
            <h2 class="content-heading">Our Space</h2>
            <p class="content-sub">Intro text, button, and photo carousel for the space section.</p>

            <section class="content-section">
              <h3 class="content-section-title">Texts</h3>
              <p class="text-sm text-palette-brown/70 mb-4">Customize title and description: font style and color.</p>
              <div class="form-field">
                <label class="form-label">Title</label>
                <input v-model="ourSpaceForm.title" type="text" class="form-input" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-field">
                  <label class="form-label">Title font</label>
                  <select v-model="ourSpaceForm.titleFontFamily" class="form-input">
                    <option v-for="f in aboutFontOptions" :key="f.value" :value="f.value">{{ f.label }}</option>
                  </select>
                </div>
                <div class="form-field">
                  <label class="form-label">Title color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(ourSpaceForm.titleColor, '#69AC7C')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="ourSpaceForm.titleColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="ourSpaceForm.titleColor" type="text" class="form-input flex-1 min-w-0" placeholder="#69AC7C" />
                  </div>
                </div>
              </div>
              <div class="form-field mt-4">
                <label class="form-label">Description</label>
                <textarea v-model="ourSpaceForm.description" rows="5" class="form-input" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="form-field">
                  <label class="form-label">Description font</label>
                  <select v-model="ourSpaceForm.textFontFamily" class="form-input">
                    <option v-for="f in aboutFontOptions" :key="f.value" :value="f.value">{{ f.label }}</option>
                  </select>
                </div>
                <div class="form-field">
                  <label class="form-label">Description color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(ourSpaceForm.textColor, '#374151')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="ourSpaceForm.textColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="ourSpaceForm.textColor" type="text" class="form-input flex-1 min-w-0" placeholder="#374151" />
                  </div>
                </div>
              </div>
            </section>

            <section class="content-section">
              <h3 class="content-section-title">Button</h3>
              <p class="text-sm text-palette-brown/70 mb-4">Customize the button: label, font, and colors (solid or gradient).</p>
              <div class="form-field">
                <label class="form-label">Button label</label>
                <input v-model="ourSpaceForm.button.text" type="text" class="form-input" />
              </div>
              <div class="form-field">
                <label class="form-label">Button font</label>
                <select v-model="ourSpaceForm.buttonFontFamily" class="form-input">
                  <option v-for="f in aboutFontOptions" :key="f.value" :value="f.value">{{ f.label }}</option>
                </select>
              </div>
              <div class="form-field">
                <label class="form-label">Button style</label>
                <div class="flex flex-wrap gap-3">
                  <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input v-model="ourSpaceForm.buttonStyle" type="radio" value="solid" class="rounded border-palette-olive/30" />
                    <span class="text-sm">Solid</span>
                  </label>
                  <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input v-model="ourSpaceForm.buttonStyle" type="radio" value="gradient" class="rounded border-palette-olive/30" />
                    <span class="text-sm">Gradient</span>
                  </label>
                </div>
              </div>
              <template v-if="ourSpaceForm.buttonStyle === 'solid'">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div class="form-field">
                    <label class="form-label">Button color</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(ourSpaceForm.buttonColor, '#69AC7C')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="ourSpaceForm.buttonColor = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="ourSpaceForm.buttonColor" type="text" class="form-input flex-1 min-w-0" placeholder="#69AC7C" />
                    </div>
                  </div>
                  <div class="form-field">
                    <label class="form-label">Button text color</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(ourSpaceForm.buttonTextColor, '#ffffff')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="ourSpaceForm.buttonTextColor = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="ourSpaceForm.buttonTextColor" type="text" class="form-input flex-1 min-w-0" placeholder="#ffffff" />
                    </div>
                  </div>
                  <div class="form-field">
                    <label class="form-label">Button hover color</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(ourSpaceForm.buttonHoverColor, '#5a9a6e')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="ourSpaceForm.buttonHoverColor = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="ourSpaceForm.buttonHoverColor" type="text" class="form-input flex-1 min-w-0" placeholder="#5a9a6e" />
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="form-field">
                    <label class="form-label">Gradient color 1</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(ourSpaceForm.buttonGradientColor1, '#69AC7C')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="ourSpaceForm.buttonGradientColor1 = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="ourSpaceForm.buttonGradientColor1" type="text" class="form-input flex-1 min-w-0" placeholder="#69AC7C" />
                    </div>
                  </div>
                  <div class="form-field">
                    <label class="form-label">Gradient color 2</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(ourSpaceForm.buttonGradientColor2, '#5a9a6e')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="ourSpaceForm.buttonGradientColor2 = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="ourSpaceForm.buttonGradientColor2" type="text" class="form-input flex-1 min-w-0" placeholder="#5a9a6e" />
                    </div>
                  </div>
                </div>
                <div class="form-field">
                  <label class="form-label">Gradient direction</label>
                  <select v-model="ourSpaceForm.buttonGradientDirection" class="form-input">
                    <option v-for="d in heroGradientDirections" :key="d.value" :value="d.value">{{ d.label }}</option>
                  </select>
                </div>
                <div class="form-field">
                  <label class="form-label">Button text color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(ourSpaceForm.buttonTextColor, '#ffffff')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="ourSpaceForm.buttonTextColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="ourSpaceForm.buttonTextColor" type="text" class="form-input flex-1 min-w-0" placeholder="#ffffff" />
                  </div>
                </div>
              </template>
            </section>

            <section class="content-section border-t border-palette-olive/15 pt-6">
              <h3 class="content-section-title">View full gallery button</h3>
              <p class="text-sm text-palette-brown/70 mb-3">Button shown below the carousel on the Our Space section that links to the gallery page.</p>
              <div class="form-field">
                <label class="form-label">Button text</label>
                <input v-model="ourSpaceForm.galleryButton.text" type="text" class="form-input" placeholder="View full gallery" />
              </div>
            </section>

            <section class="content-section border-t border-palette-olive/15 pt-6">
              <h3 class="content-section-title">Gallery page</h3>
              <p class="text-sm text-palette-brown/70 mb-3">Subtitle shown on the gallery page below the title (e.g. "Our Space Gallery").</p>
              <div class="form-field">
                <label class="form-label">Page subtitle</label>
                <textarea v-model="ourSpaceForm.galleryPageSubtitle" rows="2" class="form-input" placeholder="Explore our space with more photos..." />
              </div>
            </section>

            <section class="content-section">
              <h3 class="content-section-title">Carousel images</h3>
              <p class="text-sm text-palette-brown/80 mb-3">Use high-resolution images (e.g. 1200px wide or larger) for best quality on the homepage.</p>
              <div class="form-field">
                <AdminImageUploadList :model-value="ourSpaceForm.images" @update:model-value="(v) => (ourSpaceForm.images = v)" />
              </div>
            </section>

            <section class="content-section border-t border-palette-olive/15 pt-6">
              <h3 class="content-section-title">Preview 1 — Our Space section</h3>
              <p class="text-sm text-palette-brown/70 mb-4">Landing section: title, description, main button, carousel thumbnails, and View full gallery button.</p>
              <div class="rounded-xl border-2 border-palette-olive/25 overflow-hidden bg-white shadow-inner p-4 md:p-6">
                <h3
                  class="text-xl font-bold text-center mb-4"
                  :style="{ fontFamily: ourSpaceForm.titleFontFamily || 'Poppins', color: ourSpaceForm.titleColor || '#69AC7C' }"
                >{{ ourSpaceForm.title || 'Our Space' }}</h3>
                <p
                  class="text-sm leading-relaxed mb-4 line-clamp-3"
                  :style="{ fontFamily: ourSpaceForm.textFontFamily || 'Poppins', color: ourSpaceForm.textColor || '#374151' }"
                >{{ ourSpaceForm.description || 'Description…' }}</p>
                <span
                  class="inline-flex text-xs font-bold px-4 py-2 rounded-full uppercase"
                  :style="ourSpacePreviewButtonStyle"
                >{{ ourSpaceForm.button?.text || 'RATES' }}</span>
                <div v-if="ourSpaceForm.images && ourSpaceForm.images.length > 0" class="mt-4 grid grid-cols-4 gap-2">
                  <img
                    v-for="(img, i) in ourSpaceForm.images.slice(0, 4)"
                    :key="i"
                    :src="img"
                    :alt="`Preview ${i + 1}`"
                    class="w-full aspect-[4/3] object-cover rounded"
                  />
                </div>
                <div class="mt-4 flex justify-center">
                  <span
                    class="inline-flex text-xs font-bold px-4 py-2 rounded-full uppercase"
                    :style="ourSpacePreviewButtonStyle"
                  >{{ ourSpaceForm.galleryButton?.text || 'View full gallery' }}</span>
                </div>
              </div>
            </section>

            <section class="content-section border-t border-palette-olive/15 pt-6">
              <h3 class="content-section-title">Preview 2 — Gallery page</h3>
              <p class="text-sm text-palette-brown/70 mb-4">How the gallery page will look: back link, title, subtitle, and photo grid.</p>
              <div class="rounded-xl border-2 border-palette-olive/25 overflow-hidden bg-white shadow-inner p-4 md:p-6">
                <p class="text-xs text-palette-brown/80 mb-3 flex items-center gap-1">
                  <span aria-hidden="true">←</span> Back to Our Space
                </p>
                <h3
                  class="text-lg font-bold text-center mb-2"
                  :style="{ fontFamily: ourSpaceForm.titleFontFamily || 'Poppins', color: ourSpaceForm.titleColor || '#69AC7C' }"
                >{{ ourSpaceForm.title || 'Our Space' }} Gallery</h3>
                <p
                  class="text-xs text-palette-brown/70 text-center mb-4 line-clamp-2"
                  :style="{ fontFamily: ourSpaceForm.textFontFamily || 'Poppins', color: ourSpaceForm.textColor || '#374151' }"
                >{{ ourSpaceForm.galleryPageSubtitle || 'Explore our space with more photos…' }}</p>
                <div v-if="ourSpaceForm.images && ourSpaceForm.images.length > 0" class="grid grid-cols-4 gap-1.5">
                  <img
                    v-for="(img, i) in ourSpaceForm.images.slice(0, 4)"
                    :key="i"
                    :src="img"
                    :alt="`Gallery ${i + 1}`"
                    class="w-full aspect-square object-cover rounded"
                  />
                </div>
                <p v-else class="text-xs text-palette-brown/50 text-center py-4">No photos in the gallery yet.</p>
              </div>
            </section>

            <div class="form-actions flex flex-wrap items-center gap-3">
              <button type="submit" class="btn-primary">Save Our Space</button>
              <button type="button" class="btn-secondary" @click="resetContent">Reset</button>
            </div>
          </div>
        </form>

        <!-- Best-Selling Items -->
        <form v-show="activeTab === 'bestSelling'" class="content-form" @submit.prevent="saveSection('bestSellingItems', bestSellingForm)">
          <div class="content-card">
            <h2 class="content-heading">Best-Selling Items</h2>
            <p class="content-sub">Section title, description, and featured items on the homepage.</p>
            <section class="content-section">
              <h3 class="content-section-title">Section title</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="form-field">
                  <label class="form-label">Prefix</label>
                  <input v-model="bestSellingForm.title.prefix" type="text" class="form-input" />
                </div>
                <div class="form-field">
                  <label class="form-label">Highlight</label>
                  <input v-model="bestSellingForm.title.highlight" type="text" class="form-input" />
                </div>
                <div class="form-field">
                  <label class="form-label">Suffix</label>
                  <input v-model="bestSellingForm.title.suffix" type="text" class="form-input" />
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div class="form-field">
                  <label class="form-label">Title font</label>
                  <select v-model="bestSellingForm.titleFontFamily" class="form-input">
                    <option v-for="f in aboutFontOptions" :key="f.value" :value="f.value">{{ f.label }}</option>
                  </select>
                </div>
                <div class="form-field">
                  <label class="form-label">Title color (prefix & suffix)</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(bestSellingForm.titleColor, '#1a1a1a')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="bestSellingForm.titleColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="bestSellingForm.titleColor" type="text" class="form-input flex-1 min-w-0" placeholder="#1a1a1a" />
                  </div>
                </div>
                <div class="form-field">
                  <label class="form-label">Highlight color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(bestSellingForm.titleHighlightColor, '#3AFF86')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="bestSellingForm.titleHighlightColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="bestSellingForm.titleHighlightColor" type="text" class="form-input flex-1 min-w-0" placeholder="#3AFF86" />
                  </div>
                </div>
              </div>
              <div class="form-field mt-4">
                <label class="form-label">Section description</label>
                <textarea v-model="bestSellingForm.description" rows="3" class="form-input" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-field">
                  <label class="form-label">Description font</label>
                  <select v-model="bestSellingForm.descriptionFontFamily" class="form-input">
                    <option v-for="f in aboutFontOptions" :key="f.value" :value="f.value">{{ f.label }}</option>
                  </select>
                </div>
                <div class="form-field">
                  <label class="form-label">Description color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(bestSellingForm.descriptionColor, '#374151')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="bestSellingForm.descriptionColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="bestSellingForm.descriptionColor" type="text" class="form-input flex-1 min-w-0" placeholder="#374151" />
                  </div>
                </div>
              </div>
            </section>
            <section class="content-section border-t border-palette-olive/15 pt-6">
              <h3 class="content-section-title">View Menu button</h3>
              <p class="text-sm text-palette-brown/70 mb-4">Customize the button: label, font, and colors (solid or gradient).</p>
              <div class="form-field">
                <label class="form-label">Button label</label>
                <input v-model="bestSellingForm.viewMenuButton.text" type="text" class="form-input" />
                </div>
                  <div class="form-field">
                <label class="form-label">Button font</label>
                <select v-model="bestSellingForm.buttonFontFamily" class="form-input">
                  <option v-for="f in aboutFontOptions" :key="f.value" :value="f.value">{{ f.label }}</option>
                </select>
                  </div>
                  <div class="form-field">
                <label class="form-label">Button style</label>
                <div class="flex flex-wrap gap-3">
                  <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input v-model="bestSellingForm.buttonStyle" type="radio" value="solid" class="rounded border-palette-olive/30" />
                    <span class="text-sm">Solid</span>
                  </label>
                  <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input v-model="bestSellingForm.buttonStyle" type="radio" value="gradient" class="rounded border-palette-olive/30" />
                    <span class="text-sm">Gradient</span>
                  </label>
                  </div>
                </div>
              <template v-if="bestSellingForm.buttonStyle === 'solid'">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="form-field">
                    <label class="form-label">Button color</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(bestSellingForm.buttonColor, '#7B7557')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="bestSellingForm.buttonColor = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="bestSellingForm.buttonColor" type="text" class="form-input flex-1 min-w-0" placeholder="#7B7557" />
                    </div>
                </div>
                <div class="form-field">
                    <label class="form-label">Button text color</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(bestSellingForm.buttonTextColor, '#ffffff')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="bestSellingForm.buttonTextColor = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="bestSellingForm.buttonTextColor" type="text" class="form-input flex-1 min-w-0" placeholder="#ffffff" />
                </div>
              </div>
                  <div class="form-field">
                    <label class="form-label">Button hover color</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(bestSellingForm.buttonHoverColor, '#605B45')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="bestSellingForm.buttonHoverColor = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="bestSellingForm.buttonHoverColor" type="text" class="form-input flex-1 min-w-0" placeholder="#605B45" />
            </div>
          </div>
                </div>
              </template>
              <template v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-field">
                    <label class="form-label">Gradient color 1</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(bestSellingForm.buttonGradientColor1, '#7B7557')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="bestSellingForm.buttonGradientColor1 = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="bestSellingForm.buttonGradientColor1" type="text" class="form-input flex-1 min-w-0" placeholder="#7B7557" />
              </div>
                </div>
                <div class="form-field">
                    <label class="form-label">Gradient color 2</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(bestSellingForm.buttonGradientColor2, '#605B45')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="bestSellingForm.buttonGradientColor2 = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="bestSellingForm.buttonGradientColor2" type="text" class="form-input flex-1 min-w-0" placeholder="#605B45" />
                </div>
                  </div>
                </div>
                <div class="form-field">
                  <label class="form-label">Gradient direction</label>
                  <select v-model="bestSellingForm.buttonGradientDirection" class="form-input">
                    <option v-for="d in heroGradientDirections" :key="d.value" :value="d.value">{{ d.label }}</option>
                  </select>
                </div>
                <div class="form-field">
                  <label class="form-label">Button text color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(bestSellingForm.buttonTextColor, '#ffffff')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="bestSellingForm.buttonTextColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="bestSellingForm.buttonTextColor" type="text" class="form-input flex-1 min-w-0" placeholder="#ffffff" />
                </div>
              </div>
              </template>
            </section>
            <section class="content-section">
              <h3 class="content-section-title">Featured items</h3>
              <p class="text-sm text-palette-brown/70 mb-4">Choose items from the menu to feature as best-selling. They will use the current menu name, price, image, and description.</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                <div
                  v-for="(item, i) in bestSellingForm.items"
                  :key="item.name + i"
                  class="best-selling-card h-full rounded-xl border border-palette-olive/20 bg-white overflow-hidden shadow-sm flex flex-col"
                >
                  <div class="aspect-square w-full bg-palette-grey/30 flex-shrink-0 overflow-hidden">
                    <img
                      v-if="bestSellingMenuItemByName(item.name)"
                      :src="bestSellingMenuItemByName(item.name)?.image"
                      :alt="item.name"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-palette-brown/50 text-sm">No image</div>
                  </div>
                  <div class="flex-1 flex flex-col min-w-0 p-4 min-h-[5.5rem]">
                    <h4 class="font-semibold text-palette-brown text-sm truncate leading-tight">{{ item.name || 'Unnamed' }}</h4>
                    <div v-if="bestSellingMenuItemByName(item.name)?.variants?.length" class="mt-1 flex flex-wrap gap-1">
                      <span v-for="v in bestSellingMenuItemByName(item.name)?.variants" :key="v" class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-palette-grey/40 text-palette-brown capitalize">{{ v === 'iced' ? 'Iced' : 'Hot' }}</span>
                    </div>
                    <p v-if="bestSellingMenuItemByName(item.name)" class="text-palette-sage font-medium text-xs mt-1 leading-tight">₱{{ bestSellingMenuItemByName(item.name)?.price }}</p>
                    <p class="text-palette-brown/70 text-xs mt-1.5 line-clamp-2 min-h-[2.5rem] leading-relaxed" :class="{ 'invisible': !bestSellingMenuItemByName(item.name)?.description }">{{ bestSellingMenuItemByName(item.name)?.description || '—' }}</p>
                    <p class="mt-1 text-[10px] text-palette-olive/80">Add to Order</p>
                  </div>
                  <div class="flex-shrink-0 p-4 pt-0 border-t border-palette-olive/10">
                    <button type="button" class="item-remove w-full text-center py-2 text-sm" @click="bestSellingForm.items.splice(i, 1)">Remove from best-selling</button>
                  </div>
                </div>
              </div>
              <div class="mt-6">
                <label class="form-label block mb-2">Add from menu</label>
                <div class="relative inline-block w-full sm:w-auto sm:min-w-[280px]">
                  <button
                    ref="addMenuTriggerRef"
                    type="button"
                    class="form-input w-full text-left flex items-center gap-3 pr-10 bg-white"
                    :class="{ 'ring-2 ring-palette-sage/40': addMenuDropdownOpen }"
                    aria-haspopup="listbox"
                    :aria-expanded="addMenuDropdownOpen"
                    @click="toggleAddMenuDropdown"
                  >
                    <span class="text-palette-brown/70">— Select a menu item —</span>
                  </button>
                  <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-palette-brown/50">
                    <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': addMenuDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                  <Teleport to="body">
                    <template v-if="addMenuDropdownOpen">
                      <div class="fixed inset-0 z-[100]" aria-hidden="true" @click.self="closeAddMenuDropdown" />
                      <div
                        role="listbox"
                        class="fixed z-[101] min-w-[320px] max-w-[calc(100vw-2rem)] max-h-[min(70vh,400px)] overflow-auto rounded-xl border border-palette-olive/25 bg-white shadow-xl py-1"
                        :style="addMenuDropdownStyle"
                        @click.stop
                      >
                        <div
                          v-for="m in allMenuItemsWithDetails"
                          :key="m.name"
                          role="option"
                          :aria-selected="isAlreadyBestSelling(m.name) ? undefined : false"
                          :tabindex="isAlreadyBestSelling(m.name) ? -1 : 0"
                          class="flex items-center gap-3 px-3 py-2.5 text-left border-b border-palette-olive/5 last:border-b-0"
                          :class="isAlreadyBestSelling(m.name)
                            ? 'opacity-60 cursor-default'
                            : 'hover:bg-palette-olive/10 focus:bg-palette-olive/10 focus:outline-none cursor-pointer'"
                          @click="!isAlreadyBestSelling(m.name) && addBestSellingFromMenu(m.name)"
                          @keydown.enter.prevent="!isAlreadyBestSelling(m.name) && addBestSellingFromMenu(m.name)"
                        >
                          <div class="w-12 h-12 rounded-lg bg-palette-grey/30 flex-shrink-0 overflow-hidden">
                            <img v-if="m.image" :src="m.image" :alt="m.name" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center text-palette-brown/40 text-xs">No img</div>
                          </div>
                          <div class="min-w-0 flex-1">
                            <span class="font-medium text-palette-brown text-sm block truncate">{{ m.name }}</span>
                            <span class="text-palette-brown/60 text-xs block">{{ m.category }} · ₱{{ m.price }}</span>
                          </div>
                          <span v-if="isAlreadyBestSelling(m.name)" class="flex-shrink-0 text-xs text-palette-sage font-medium">Already added</span>
                        </div>
                      </div>
                    </template>
                  </Teleport>
                </div>
              </div>
            </section>
            <section class="content-section border-t border-palette-olive/15 pt-6">
              <h3 class="content-section-title">Full section preview</h3>
              <p class="text-sm text-palette-brown/70 mb-4">Preview the whole Best-Selling section with your current edits. Use Reset to discard unsaved changes.</p>
              <div class="rounded-xl border-2 border-palette-olive/25 overflow-hidden bg-white shadow-inner p-4 md:p-6">
                <h3
                  class="text-xl font-bold text-center mb-3"
                  :style="{ fontFamily: bestSellingForm.titleFontFamily || 'Poppins', color: bestSellingForm.titleColor || '#1a1a1a' }"
                >
                  {{ bestSellingForm.title?.prefix || 'Our' }}
                  <span :style="{ color: bestSellingForm.titleHighlightColor || '#3AFF86' }">{{ bestSellingForm.title?.highlight || 'Best-Selling' }}</span>
                  {{ bestSellingForm.title?.suffix || 'Items' }}
                </h3>
                <p
                  class="text-sm leading-relaxed mb-4 line-clamp-3 text-center"
                  :style="{ fontFamily: bestSellingForm.descriptionFontFamily || 'Poppins', color: bestSellingForm.descriptionColor || '#374151' }"
                >
                  {{ bestSellingForm.description || 'Section description…' }}
                </p>
                <div v-if="bestSellingForm.items?.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <template v-for="(item, i) in bestSellingForm.items.slice(0, 4)" :key="item.name + i">
                    <div v-if="bestSellingMenuItemByName(item.name)" class="preview-menu-card flex flex-col rounded-xl border border-palette-olive/15 bg-white shadow-sm overflow-hidden p-2">
                      <div class="aspect-square w-full rounded-lg overflow-hidden bg-palette-grey/30 flex-shrink-0">
                        <img :src="bestSellingMenuItemByName(item.name)?.image" :alt="item.name" class="w-full h-full object-cover" />
                      </div>
                      <h4 class="mt-1.5 font-bold text-palette-brown text-xs line-clamp-2">{{ bestSellingMenuItemByName(item.name)?.name }}</h4>
                      <div v-if="bestSellingMenuItemByName(item.name)?.variants?.length" class="mt-1 flex flex-wrap gap-1">
                        <span v-for="v in bestSellingMenuItemByName(item.name)?.variants" :key="v" class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-palette-grey/40 text-palette-brown capitalize">{{ v === 'iced' ? 'Iced' : 'Hot' }}</span>
                      </div>
                      <p class="mt-1 font-medium text-palette-brown text-[10px]">₱{{ bestSellingMenuItemByName(item.name)?.price }}</p>
                      <p v-if="bestSellingMenuItemByName(item.name)?.description" class="mt-0.5 text-palette-olive text-[10px] leading-tight line-clamp-2">{{ bestSellingMenuItemByName(item.name)?.description }}</p>
                      <div class="mt-auto pt-1.5">
                        <span class="block w-full py-1 rounded-full text-white font-semibold text-[10px] text-center" style="background-color: #7B7557">Add to Order</span>
                      </div>
                    </div>
                  </template>
                </div>
                <div class="flex justify-center">
                  <span
                    class="inline-flex text-xs font-bold px-4 py-2 rounded-full uppercase"
                    :style="bestSellingPreviewButtonStyle"
                  >{{ bestSellingForm.viewMenuButton?.text || 'View Menu' }}</span>
                </div>
              </div>
            </section>
            <div class="form-actions flex flex-wrap items-center gap-3">
              <button type="submit" class="btn-primary">Save Best-Selling</button>
              <button type="button" class="btn-secondary" @click="resetContent">Reset</button>
            </div>
          </div>
        </form>

        <!-- FAQ -->
        <form v-show="activeTab === 'faq'" class="content-form" @submit.prevent="saveSection('faq', faqForm)">
          <div class="content-card">
            <h2 class="content-heading">Frequently Asked Questions</h2>
            <p class="content-sub">Questions and answers shown in the FAQ section.</p>
            <section class="content-section">
              <div class="form-field">
                <label class="form-label">Section title</label>
                <input v-model="faqForm.title" type="text" class="form-input" />
              </div>
            </section>
            <section class="content-section">
              <h3 class="content-section-title">Q&amp;A items</h3>
              <div v-for="(item, i) in faqForm.items" :key="item.id" class="item-block">
                <div class="item-block-header">
                  <span>Question {{ i + 1 }}</span>
                  <button type="button" class="item-remove" @click="faqForm.items.splice(i, 1)">Remove</button>
                </div>
                <div class="form-field">
                  <label class="form-label">Question</label>
                  <input v-model="item.question" type="text" class="form-input" />
                </div>
                <div class="form-field">
                  <label class="form-label">Answer</label>
                  <textarea v-model="item.answer" rows="3" class="form-input" />
                </div>
              </div>
              <button type="button" class="btn-secondary mt-2" @click="addFaq">+ Add question</button>
            </section>
            <div class="form-actions flex flex-wrap items-center gap-3">
              <button type="submit" class="btn-primary">Save FAQ</button>
              <button type="button" class="btn-secondary" @click="resetContent">Reset</button>
            </div>
          </div>
        </form>

        <!-- Contact -->
        <form v-show="activeTab === 'contact'" class="content-form" @submit.prevent="saveContactSection">
          <div class="content-card">
            <h2 class="content-heading">Contact Us</h2>
            <p class="content-sub">Contact section title, images, form labels, and map.</p>
            <section class="content-section">
              <div class="form-field">
                <label class="form-label">Section title</label>
                <input v-model="contactForm.title" type="text" class="form-input" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="form-field">
                  <label class="form-label">Background image</label>
                  <AdminImageUpload v-model="contactForm.backgroundImage" />
                </div>
                <div class="form-field">
                  <label class="form-label">Building image</label>
                  <AdminImageUpload v-model="contactForm.buildingImage" />
                </div>
              </div>
            </section>
            <section class="content-section">
              <h3 class="content-section-title">Map</h3>
              <div class="form-field">
                <label class="form-label">Map heading</label>
                <input v-model="contactForm.map.title" type="text" class="form-input" />
              </div>
              <div class="form-field">
                <label class="form-label">Full address</label>
                <input v-model="contactForm.map.location" type="text" class="form-input" placeholder="e.g. 555 Don Anselmo Bernad Avenue, Ozamiz, Misamis Occidental" />
                <p class="form-hint mt-1">Enter the full address. The map on the Contact Us page will update when you click Save Contact.</p>
              </div>
            </section>
            <div class="form-actions flex flex-wrap items-center gap-3">
              <button type="submit" class="btn-primary">Save Contact</button>
              <button type="button" class="btn-secondary" @click="resetContent">Reset</button>
            </div>
          </div>
        </form>

        <!-- Footer -->
        <form v-show="activeTab === 'footer'" class="content-form" @submit.prevent="saveSection('footer', footerForm)">
          <div class="content-card">
            <h2 class="content-heading">Footer</h2>
            <p class="content-sub">Logo, address, and business hours at the bottom of every page.</p>
            <section class="content-section">
              <h3 class="content-section-title">Brand</h3>
              <div class="form-field">
                <label class="form-label">Logo image</label>
                <AdminImageUpload v-model="footerForm.logo.image" />
              </div>
              <div class="form-field">
                <label class="form-label">Logo text</label>
                <input v-model="footerForm.logo.text" type="text" class="form-input" />
              </div>
              <div class="form-field">
                <label class="form-label">Tagline</label>
                <input v-model="footerForm.logo.tagline" type="text" class="form-input" />
              </div>
            </section>
            <section class="content-section">
              <h3 class="content-section-title">Social links (Location column icons)</h3>
              <div class="form-field">
                <label class="form-label">Facebook URL</label>
                <input v-model="footerForm.socialLinks.facebook" type="url" class="form-input" placeholder="https://www.facebook.com/..." />
              </div>
              <div class="form-field">
                <label class="form-label">Instagram URL</label>
                <input v-model="footerForm.socialLinks.instagram" type="url" class="form-input" placeholder="https://www.instagram.com/..." />
              </div>
              <div class="form-field">
                <label class="form-label">Email address</label>
                <input v-model="footerForm.socialLinks.email" type="email" class="form-input" placeholder="email@example.com" />
              </div>
            </section>
            <section class="content-section">
              <h3 class="content-section-title">Location & hours</h3>
              <div class="form-field">
                <label class="form-label">Location heading</label>
                <input v-model="footerForm.location.title" type="text" class="form-input" />
              </div>
              <div class="form-field">
                <label class="form-label">Full address</label>
                <textarea v-model="footerForm.location.address" rows="2" class="form-input" />
              </div>
              <div class="form-field">
                <label class="form-label">Business hours heading</label>
                <input v-model="footerForm.businessHours.title" type="text" class="form-input" />
              </div>
              <div class="form-field">
                <label class="form-label">Hours (one line per entry)</label>
                <textarea v-model="footerHoursText" rows="3" class="form-input" placeholder="Monday to Saturday" />
              </div>
              <div class="form-field">
                <label class="form-label">Powered by / credit</label>
                <input v-model="footerForm.poweredBy" type="text" class="form-input" />
              </div>
            </section>
            <div class="form-actions flex flex-wrap items-center gap-3">
              <button type="submit" class="btn-primary">Save Footer</button>
              <button type="button" class="btn-secondary" @click="resetContent">Reset</button>
            </div>
          </div>
        </form>

        <!-- Hero -->
        <form v-show="activeTab === 'hero'" class="content-form" @submit.prevent="saveSection('hero', heroForm)">
          <div class="content-card">
            <h2 class="content-heading">Hero (Homepage)</h2>
            <p class="content-sub">Top banner: background image, headline, and buttons.</p>
            <section class="content-section">
              <div class="form-field">
                <label class="form-label">Background image</label>
                <AdminImageUpload v-model="heroForm.backgroundImage" />
              </div>
              <div class="form-field">
                <label class="form-label">Subtitle</label>
                <input v-model="heroForm.subtitle" type="text" class="form-input" />
              </div>
              <div class="form-field">
                <label class="form-label">Main title</label>
                <input v-model="heroForm.title" type="text" class="form-input" />
              </div>
              <div class="form-field">
                <label class="form-label">Highlighted word (in title)</label>
                <input v-model="heroForm.titleHighlight" type="text" class="form-input" placeholder="e.g. here" />
              </div>
              <div class="form-field">
                <label class="form-label">Short description</label>
                <textarea v-model="heroForm.description" rows="2" class="form-input" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="form-field">
                  <label class="form-label">Text color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(heroForm.textColor, '#1a1a1a')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="heroForm.textColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="heroForm.textColor" type="text" class="form-input flex-1 min-w-0" placeholder="#1a1a1a" />
                  </div>
                </div>
                <div class="form-field">
                  <label class="form-label">Title highlight color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(heroForm.titleHighlightColor, '#3AFF86')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="heroForm.titleHighlightColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="heroForm.titleHighlightColor" type="text" class="form-input flex-1 min-w-0" placeholder="#3AFF86" />
                  </div>
                </div>
              </div>
              <!-- Primary button -->
              <div class="mt-6 pt-6 border-t border-palette-olive/15">
                <h3 class="content-section-title text-palette-sage mb-4">Primary button</h3>
                <p class="text-sm text-palette-brown/70 mb-4">The main CTA (e.g. “Order now”).</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="form-field">
                  <label class="form-label">Button label</label>
                  <input v-model="heroForm.buttons[0].text" type="text" class="form-input" />
                </div>
                <div class="form-field">
                  <label class="form-label">Style</label>
                  <div class="flex flex-wrap gap-3">
                    <label class="inline-flex items-center gap-2 cursor-pointer">
                      <input v-model="heroForm.primaryButtonStyle" type="radio" value="solid" class="rounded border-palette-olive/30" />
                      <span class="text-sm">Solid</span>
                    </label>
                    <label class="inline-flex items-center gap-2 cursor-pointer">
                      <input v-model="heroForm.primaryButtonStyle" type="radio" value="gradient" class="rounded border-palette-olive/30" />
                      <span class="text-sm">Gradient</span>
                    </label>
                  </div>
                </div>
                <div class="form-field">
                  <label class="form-label">Primary button text color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(heroForm.primaryButtonTextColor, '#ffffff')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="heroForm.primaryButtonTextColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="heroForm.primaryButtonTextColor" type="text" class="form-input flex-1 min-w-0" placeholder="#ffffff" />
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4" :class="{ 'sm:grid-cols-2': heroForm.primaryButtonStyle === 'gradient' }">
                <template v-if="heroForm.primaryButtonStyle === 'solid'">
                  <div class="form-field sm:col-span-2">
                    <label class="form-label">Primary button color</label>
                    <div class="flex items-center gap-2 max-w-xs">
                      <input
                        type="color"
                        :value="heroColorForPicker(heroForm.primaryButtonColor, '#69AC7C')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="heroForm.primaryButtonColor = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="heroForm.primaryButtonColor" type="text" class="form-input flex-1 min-w-0" placeholder="#69AC7C" />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="form-field">
                    <label class="form-label">Primary gradient color 1</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(heroForm.primaryGradientColor1, '#69AC7C')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="heroForm.primaryGradientColor1 = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="heroForm.primaryGradientColor1" type="text" class="form-input flex-1 min-w-0" placeholder="#69AC7C" />
                    </div>
                  </div>
                  <div class="form-field">
                    <label class="form-label">Primary gradient color 2</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(heroForm.primaryGradientColor2, '#5a9a6e')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="heroForm.primaryGradientColor2 = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="heroForm.primaryGradientColor2" type="text" class="form-input flex-1 min-w-0" placeholder="#5a9a6e" />
                    </div>
                  </div>
                  <div class="form-field">
                    <label class="form-label">Primary gradient direction</label>
                    <select v-model="heroForm.primaryGradientDirection" class="form-input">
                      <option v-for="d in heroGradientDirections" :key="d.value" :value="d.value">{{ d.label }}</option>
                    </select>
                  </div>
                </template>
              </div>
              <!-- Secondary button -->
              <div class="mt-8 pt-6 border-t border-palette-olive/15">
                <h3 class="content-section-title text-palette-sage mb-4">Secondary button</h3>
                <p class="text-sm text-palette-brown/70 mb-4">The second button (e.g. “Book our space”).</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="form-field">
                  <label class="form-label">Button label</label>
                  <input v-model="heroForm.buttons[1].text" type="text" class="form-input" />
                </div>
                <div class="form-field">
                  <label class="form-label">Style</label>
                  <div class="flex flex-wrap gap-3">
                    <label class="inline-flex items-center gap-2 cursor-pointer">
                      <input v-model="heroForm.secondaryButtonStyle" type="radio" value="solid" class="rounded border-palette-olive/30" />
                      <span class="text-sm">Solid</span>
                    </label>
                    <label class="inline-flex items-center gap-2 cursor-pointer">
                      <input v-model="heroForm.secondaryButtonStyle" type="radio" value="gradient" class="rounded border-palette-olive/30" />
                      <span class="text-sm">Gradient</span>
                    </label>
                  </div>
                </div>
                <div class="form-field">
                  <label class="form-label">Secondary button text color</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="color"
                      :value="heroColorForPicker(heroForm.secondaryButtonTextColor, '#7B7557')"
                      class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                      @input="heroForm.secondaryButtonTextColor = ($event.target as HTMLInputElement).value"
                    />
                    <input v-model="heroForm.secondaryButtonTextColor" type="text" class="form-input flex-1 min-w-0" placeholder="#7B7557" />
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4" :class="{ 'sm:grid-cols-2': heroForm.secondaryButtonStyle === 'gradient' }">
                <template v-if="heroForm.secondaryButtonStyle === 'solid'">
                  <div class="form-field sm:col-span-2">
                    <label class="form-label">Secondary button color</label>
                    <div class="flex items-center gap-2 max-w-xs">
                      <input
                        type="color"
                        :value="heroColorForPicker(heroForm.secondaryButtonColor, '#7B7557')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="heroForm.secondaryButtonColor = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="heroForm.secondaryButtonColor" type="text" class="form-input flex-1 min-w-0" placeholder="#7B7557" />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="form-field">
                    <label class="form-label">Secondary gradient color 1</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(heroForm.secondaryGradientColor1, '#7B7557')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="heroForm.secondaryGradientColor1 = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="heroForm.secondaryGradientColor1" type="text" class="form-input flex-1 min-w-0" placeholder="#7B7557" />
                    </div>
                  </div>
                  <div class="form-field">
                    <label class="form-label">Secondary gradient color 2</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="heroColorForPicker(heroForm.secondaryGradientColor2, '#605B45')"
                        class="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                        @input="heroForm.secondaryGradientColor2 = ($event.target as HTMLInputElement).value"
                      />
                      <input v-model="heroForm.secondaryGradientColor2" type="text" class="form-input flex-1 min-w-0" placeholder="#605B45" />
                    </div>
                  </div>
                  <div class="form-field">
                    <label class="form-label">Secondary gradient direction</label>
                    <select v-model="heroForm.secondaryGradientDirection" class="form-input">
                      <option v-for="d in heroGradientDirections" :key="d.value" :value="d.value">{{ d.label }}</option>
                    </select>
                  </div>
                </template>
              </div>
            </section>
            <!-- Hero live preview -->
            <section class="content-section border-t border-palette-olive/15 pt-6">
              <h3 class="content-section-title">Preview</h3>
              <p class="text-sm text-palette-brown/70 mb-4">How the hero will look with your current edits. Save to apply to the live site.</p>
              <div class="rounded-xl border border-palette-olive/20 overflow-hidden bg-white shadow-inner">
                <div class="relative min-h-[280px] flex flex-col justify-start pt-4 overflow-hidden">
                  <div v-if="heroForm.backgroundImage" class="absolute inset-0">
                    <img :src="heroForm.backgroundImage" :alt="heroForm.backgroundImageAlt" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-white/65" aria-hidden="true" />
                  </div>
                  <div v-else class="absolute inset-0 bg-palette-olive/10" aria-hidden="true" />
                  <div class="relative z-10 text-center px-4 max-w-2xl mx-auto font-poppins">
                    <h5 class="text-xs sm:text-sm font-bold uppercase tracking-widest mb-1" :style="{ color: heroForm.textColor || '#1a1a1a' }">{{ heroForm.subtitle || 'Subtitle' }}</h5>
                    <h2 class="text-lg sm:text-xl font-extrabold leading-tight mb-2" :style="{ color: heroForm.textColor || '#1a1a1a' }">
                      {{ heroForm.title || 'Title' }} <span :style="{ color: heroForm.titleHighlightColor || '#3AFF86' }">{{ heroForm.titleHighlight || 'here' }}</span>.
                    </h2>
                    <p class="text-sm max-w-xl mx-auto mb-4 leading-relaxed line-clamp-2" :style="{ color: heroForm.textColor || '#1a1a1a' }">{{ heroForm.description || 'Description' }}</p>
                    <div class="flex flex-wrap justify-center gap-2">
                      <span
                        v-for="(button, index) in heroForm.buttons"
                        :key="index"
                        class="font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wide border-2"
                        :class="{ 'bg-transparent': button.type === 'secondary' && heroForm.secondaryButtonStyle === 'solid' }"
                        :style="button.type === 'primary' ? heroPreviewPrimaryButtonStyle : heroPreviewSecondaryButtonStyle"
                      >
                        {{ button.text || 'Button' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div class="form-actions flex flex-wrap items-center gap-3">
              <button type="submit" class="btn-primary">Save Hero</button>
              <button type="button" class="btn-secondary" @click="resetContent">Reset</button>
            </div>
          </div>
        </form>

      </template>

      <!-- Save feedback -->
      <Transition name="fade">
        <div
          v-if="saveMessage"
          class="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm border shadow-sm max-w-3xl mx-auto"
          :class="saveSuccess ? 'bg-palette-sage/10 border-palette-sage/30 text-palette-sage' : 'bg-red-50/90 border-red-200 text-red-700'"
        >
          <span v-if="saveSuccess" class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-palette-sage/20">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          </span>
          <span v-else class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </span>
          <span>{{ saveMessage }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import staticSiteData from '~/data/site-data'
import menuJson from '~/data/menu.json'

definePageMeta({ layout: 'manager' })

type MenuCategory = { category: string; items: { id: number; name: string; price: number; image: string; description?: string; variants?: string[] }[] }
const menuData = menuJson as MenuCategory[]

const tabs = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About Us' },
  { id: 'ourSpace', label: 'Our Space' },
  { id: 'bestSelling', label: 'Best-Selling' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
  { id: 'footer', label: 'Footer' },
]

const activeTab = ref('hero')
const loading = ref(true)
const saveMessage = ref('')
const saveSuccess = ref(false)

type SiteContent = {
  hero?: Record<string, unknown>
  about?: Record<string, unknown>
  ourSpace?: Record<string, unknown>
  bestSellingItems?: Record<string, unknown>
  faq?: Record<string, unknown>
  contact?: Record<string, unknown>
  footer?: Record<string, unknown>
}

const aboutFontOptions = [
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'Playfair Display', label: 'Playfair Display (serif)' },
  { value: 'Merriweather', label: 'Merriweather (serif)' },
  { value: 'Georgia', label: 'Georgia (serif)' },
  { value: 'Oswald', label: 'Oswald' },
  { value: 'system-ui', label: 'System default' },
] as const

const defaultAbout = () => ({
  title: 'About us',
  paragraphs: ['', '', ''],
  image: '/images/about.jpeg',
  imageAlt: '',
  overlayText: '',
  button: { text: 'LEARN MORE', action: 'learn-more' },
  titleFontFamily: 'Poppins',
  textFontFamily: 'Poppins',
  titleColor: '#7B7557',
  textColor: '#1E1E1E',
  buttonFontFamily: 'Poppins',
  buttonStyle: 'solid' as 'solid' | 'gradient',
  buttonColor: '#7B7557',
  buttonGradientColor1: '#7B7557',
  buttonGradientColor2: '#605B45',
  buttonGradientDirection: 'to right',
  buttonTextColor: '#ffffff',
  buttonHoverColor: '#605B45',
})
const defaultOurSpace = () => ({
  title: 'Our Space',
  titleFontFamily: 'Poppins',
  titleColor: '#69AC7C',
  description: '',
  textFontFamily: 'Poppins',
  textColor: '#374151',
  button: { text: 'RATES', action: 'rates' },
  buttonFontFamily: 'Poppins',
  buttonStyle: 'solid' as 'solid' | 'gradient',
  buttonColor: '#69AC7C',
  buttonGradientColor1: '#69AC7C',
  buttonGradientColor2: '#5a9a6e',
  buttonGradientDirection: 'to right',
  buttonTextColor: '#ffffff',
  buttonHoverColor: '#5a9a6e',
  galleryButton: { text: 'View full gallery' },
  galleryPageSubtitle: 'Explore our space with more photos from our coworking and study hub.',
  images: [] as string[],
  carousel: { itemsPerGroup: 4, autoSlideInterval: 5000 },
})
const defaultBestSelling = () => ({
  title: { prefix: 'Our', highlight: 'Best-Selling', suffix: 'Items' },
  titleFontFamily: 'Poppins',
  titleColor: '#1a1a1a',
  titleHighlightColor: '#3AFF86',
  description: '',
  descriptionFontFamily: 'Poppins',
  descriptionColor: '#374151',
  items: [] as { name: string }[],
  viewMenuButton: { text: 'Fuel your focus', action: 'view-menu' },
  buttonFontFamily: 'Poppins',
  buttonStyle: 'solid' as 'solid' | 'gradient',
  buttonColor: '#7B7557',
  buttonGradientColor1: '#7B7557',
  buttonGradientColor2: '#605B45',
  buttonGradientDirection: 'to right',
  buttonTextColor: '#ffffff',
  buttonHoverColor: '#605B45',
})
const defaultFaq = () => ({
  title: 'Frequently Asked Questions',
  items: [] as { id: string; question: string; answer: string }[],
})
const defaultContact = () => ({
  title: 'Contact Us',
  form: {
    firstName: { label: '', placeholder: '' },
    lastName: { label: '', placeholder: '' },
    email: { label: '', placeholder: '' },
    phone: { label: '', placeholder: '' },
    subject: { label: '', placeholder: '' },
    message: { label: '', placeholder: '' },
  },
  map: { title: '', embedUrl: '', location: '', placeName: '' },
  buildingImage: '',
  backgroundImage: '',
})
const defaultFooter = () => ({
  logo: { image: '', text: '', tagline: '' },
  sitemap: { title: 'Sitemap', links: [] as { text: string; to: string }[] },
  location: { title: 'Location', address: '' },
  socialLinks: { facebook: '', instagram: '', email: '' },
  businessHours: { title: 'Business Hours', hours: [] as string[] },
  poweredBy: '',
})
const defaultHero = () => ({
  backgroundImage: '',
  backgroundImageAlt: '',
  subtitle: '',
  title: '',
  titleHighlight: 'here',
  description: '',
  textColor: '#1a1a1a',
  titleHighlightColor: '#3AFF86',
  primaryButtonColor: '#69AC7C',
  primaryButtonStyle: 'solid' as 'solid' | 'gradient',
  primaryGradientColor1: '#69AC7C',
  primaryGradientColor2: '#5a9a6e',
  primaryGradientDirection: 'to right',
  primaryButtonTextColor: '#ffffff',
  secondaryButtonColor: '#7B7557',
  secondaryButtonStyle: 'solid' as 'solid' | 'gradient',
  secondaryGradientColor1: '#7B7557',
  secondaryGradientColor2: '#605B45',
  secondaryGradientDirection: 'to right',
  secondaryButtonTextColor: '#7B7557',
  buttons: [{ text: 'ORDER NOW', type: 'primary', action: 'order' }, { text: 'BOOK OUR SPACE', type: 'secondary', action: 'book' }],
})
const heroGradientDirections = [
  { value: 'to right', label: 'Left → Right' },
  { value: 'to left', label: 'Right → Left' },
  { value: 'to bottom', label: 'Top → Bottom' },
  { value: 'to top', label: 'Bottom → Top' },
  { value: 'to bottom right', label: 'Top-left → Bottom-right' },
  { value: 'to top left', label: 'Bottom-right → Top-left' },
] as const
const aboutForm = ref<ReturnType<typeof defaultAbout>>(defaultAbout())
const ourSpaceForm = ref<ReturnType<typeof defaultOurSpace>>(defaultOurSpace())
const bestSellingForm = ref<ReturnType<typeof defaultBestSelling>>(defaultBestSelling())
const faqForm = ref<ReturnType<typeof defaultFaq>>(defaultFaq())
const contactForm = ref<ReturnType<typeof defaultContact>>(defaultContact())
const footerForm = ref<ReturnType<typeof defaultFooter>>(defaultFooter())
const heroForm = ref<ReturnType<typeof defaultHero>>(defaultHero())

const heroPreviewPrimaryButtonStyle = computed(() => {
  const h = heroForm.value
  const color = h.primaryButtonTextColor || '#ffffff'
  if (h.primaryButtonStyle === 'gradient') {
    const dir = h.primaryGradientDirection || 'to right'
    const c1 = h.primaryGradientColor1 || '#69AC7C'
    const c2 = h.primaryGradientColor2 || '#5a9a6e'
    return { background: `linear-gradient(${dir}, ${c1}, ${c2})`, borderColor: 'transparent', color }
  }
  const bg = h.primaryButtonColor || '#69AC7C'
  return { backgroundColor: bg, borderColor: bg, color }
})

const heroPreviewSecondaryButtonStyle = computed(() => {
  const h = heroForm.value
  const textColor = h.secondaryButtonTextColor || h.secondaryButtonColor || '#7B7557'
  if (h.secondaryButtonStyle === 'gradient') {
    const dir = h.secondaryGradientDirection || 'to right'
    const c1 = h.secondaryGradientColor1 || '#7B7557'
    const c2 = h.secondaryGradientColor2 || '#605B45'
    return { background: `linear-gradient(${dir}, ${c1}, ${c2})`, borderColor: 'transparent', color: textColor }
  }
  return { borderColor: h.secondaryButtonColor || '#7B7557', color: textColor }
})

const aboutPreviewButtonStyle = computed(() => {
  const a = aboutForm.value
  const font = a.buttonFontFamily || 'Poppins'
  const color = a.buttonTextColor || '#ffffff'
  if (a.buttonStyle === 'gradient') {
    const dir = a.buttonGradientDirection || 'to right'
    const c1 = a.buttonGradientColor1 || '#7B7557'
    const c2 = a.buttonGradientColor2 || '#605B45'
    return { fontFamily: font, background: `linear-gradient(${dir}, ${c1}, ${c2})`, borderColor: 'transparent', color }
  }
  return { fontFamily: font, backgroundColor: a.buttonColor || '#7B7557', borderColor: a.buttonColor || '#7B7557', color }
})

const ourSpacePreviewButtonStyle = computed(() => {
  const o = ourSpaceForm.value
  const font = o.buttonFontFamily || 'Poppins'
  const color = o.buttonTextColor || '#ffffff'
  if (o.buttonStyle === 'gradient') {
    const dir = o.buttonGradientDirection || 'to right'
    const c1 = o.buttonGradientColor1 || '#69AC7C'
    const c2 = o.buttonGradientColor2 || '#5a9a6e'
    return { fontFamily: font, background: `linear-gradient(${dir}, ${c1}, ${c2})`, borderColor: 'transparent', color }
  }
  return { fontFamily: font, backgroundColor: o.buttonColor || '#69AC7C', borderColor: o.buttonColor || '#69AC7C', color }
})

const bestSellingPreviewButtonStyle = computed(() => {
  const b = bestSellingForm.value
  const font = b.buttonFontFamily || 'Poppins'
  const color = b.buttonTextColor || '#ffffff'
  if (b.buttonStyle === 'gradient') {
    const dir = b.buttonGradientDirection || 'to right'
    const c1 = b.buttonGradientColor1 || '#7B7557'
    const c2 = b.buttonGradientColor2 || '#605B45'
    return { fontFamily: font, background: `linear-gradient(${dir}, ${c1}, ${c2})`, borderColor: 'transparent', color }
  }
  return { fontFamily: font, backgroundColor: b.buttonColor || '#7B7557', borderColor: b.buttonColor || '#7B7557', color }
})

const aboutParagraphsText = computed({
  get: () => (aboutForm.value.paragraphs || []).join('\n'),
  set: (v: string) => { aboutForm.value.paragraphs = v ? v.split('\n').map(p => p.trim()) : [] },
})
const footerHoursText = computed({
  get: () => (footerForm.value.businessHours?.hours || []).join('\n'),
  set: (v: string) => { footerForm.value.businessHours = footerForm.value.businessHours || { title: '', hours: [] }; footerForm.value.businessHours.hours = v ? v.split('\n').map(h => h.trim()).filter(Boolean) : [] },
})

const contactMapPreviewUrl = computed(() => {
  const loc = contactForm.value.map.location
  if (loc?.trim()) return buildMapEmbedUrl(loc)
  return contactForm.value.map.embedUrl || ''
})

/** Normalize hex to #rrggbb for native color picker (accepts 3- or 6-digit). */
function heroColorForPicker(hex: string | undefined, fallback: string): string {
  const raw = (hex || fallback).trim()
  if (!raw.startsWith('#')) return fallback
  const h = raw.slice(1)
  if (/^[0-9A-Fa-f]{6}$/.test(h)) return raw
  if (/^[0-9A-Fa-f]{3}$/.test(h)) return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`
  return fallback
}

function applyContent(data: SiteContent) {
  if (data.about) {
    const a = data.about as ReturnType<typeof defaultAbout>
    aboutForm.value = { ...defaultAbout(), ...a, paragraphs: Array.isArray(a.paragraphs) ? [...a.paragraphs] : aboutForm.value.paragraphs, button: { ...defaultAbout().button, ...a.button } }
  }
  if (data.ourSpace) {
    const o = data.ourSpace as ReturnType<typeof defaultOurSpace>
    ourSpaceForm.value = {
      ...defaultOurSpace(),
      ...o,
      images: Array.isArray(o.images) ? [...o.images] : [],
      carousel: { ...defaultOurSpace().carousel, ...o.carousel },
      button: { ...defaultOurSpace().button, ...o.button },
      galleryButton: { ...defaultOurSpace().galleryButton, ...o.galleryButton },
    }
  }
  if (data.bestSellingItems) {
    const b = data.bestSellingItems as ReturnType<typeof defaultBestSelling> & { items?: { name?: string }[] }
    const normalizedItems = (b.items || []).map((i) => ({ name: typeof i === 'object' && i && 'name' in i ? String(i.name) : '' })).filter((i) => i.name)
    bestSellingForm.value = {
      ...defaultBestSelling(),
      ...b,
      title: { ...defaultBestSelling().title, ...b.title },
      items: normalizedItems,
      viewMenuButton: { ...defaultBestSelling().viewMenuButton, ...b.viewMenuButton },
    }
  }
  if (data.faq) {
    const f = data.faq as ReturnType<typeof defaultFaq>
    faqForm.value = { title: f.title || defaultFaq().title, items: (f.items || []).map(i => ({ ...i })) }
  }
  if (data.contact) {
    const c = data.contact as ReturnType<typeof defaultContact>
    contactForm.value = { ...defaultContact(), ...c, form: { ...defaultContact().form, ...c.form }, map: { ...defaultContact().map, ...c.map } }
    if (contactForm.value.map.embedUrl && !contactForm.value.map.location) {
      const match = contactForm.value.map.embedUrl.match(/[?&]q=([^&]+)/)
      if (match) contactForm.value.map.location = decodeURIComponent(match[1].replace(/\+/g, ' '))
    }
  }
  if (data.footer) {
    const f = data.footer as ReturnType<typeof defaultFooter>
    footerForm.value = { ...defaultFooter(), ...f, logo: { ...defaultFooter().logo, ...f.logo }, sitemap: { ...defaultFooter().sitemap, ...f.sitemap, links: (f.sitemap?.links || []).map(l => ({ ...l })) }, location: { ...defaultFooter().location, ...f.location }, socialLinks: { ...defaultFooter().socialLinks, ...f.socialLinks }, businessHours: { ...defaultFooter().businessHours, ...f.businessHours, hours: [...(f.businessHours?.hours || [])] } }
  }
  if (data.hero) {
    const h = data.hero as ReturnType<typeof defaultHero>
    heroForm.value = { ...defaultHero(), ...h, buttons: (h.buttons || defaultHero().buttons).map((b: Record<string, string>, i: number) => ({ ...defaultHero().buttons[i], ...b })) }
  }
}

async function loadContent() {
  loading.value = true
  try {
    const data = await $fetch<SiteContent>('/api/site-content')
    applyContent(data)
  } catch {
    applyContent(staticSiteData as unknown as SiteContent)
  } finally {
    loading.value = false
  }
}

async function resetContent() {
  await loadContent()
  saveMessage.value = 'Changes discarded.'
  saveSuccess.value = true
  setTimeout(() => { saveMessage.value = '' }, 2000)
}

function addFaq() {
  faqForm.value.items.push({ id: `faq-${Date.now()}`, question: '', answer: '' })
}
const allMenuItemsFlat = computed(() => {
  const list: { name: string; category: string }[] = []
  for (const cat of menuData) {
    for (const item of cat.items) {
      list.push({ name: item.name, category: cat.category })
    }
  }
  return list
})
const menuItemByName = computed(() => {
  const map: Record<string, { id: number; name: string; price: number; image: string; description?: string; variants?: string[]; category: string }> = {}
  for (const cat of menuData) {
    for (const item of cat.items) {
      map[item.name] = { ...item, category: cat.category }
    }
  }
  return map
})
function bestSellingMenuItemByName(name: string) {
  return name ? menuItemByName.value[name] : undefined
}
const menuItemsAvailableForBestSelling = computed(() => {
  const names = new Set(bestSellingForm.value.items.map((i) => i.name))
  return allMenuItemsFlat.value.filter((m) => !names.has(m.name))
})
/** All menu items with details, for the dropdown list (includes already-added items) */
const allMenuItemsWithDetails = computed(() => {
  const map = menuItemByName.value
  return allMenuItemsFlat.value.map((m) => ({
    name: m.name,
    category: m.category,
    image: map[m.name]?.image,
    price: map[m.name]?.price,
  }))
})
function isAlreadyBestSelling(itemName: string) {
  return bestSellingForm.value.items.some((i) => i.name === itemName)
}
const addMenuDropdownOpen = ref(false)
const addMenuTriggerRef = ref<HTMLButtonElement | null>(null)
const addMenuDropdownPosition = ref({ top: 0, left: 0, minWidth: 280 })
const addMenuDropdownStyle = computed(() => ({
  top: `${addMenuDropdownPosition.value.top}px`,
  left: `${addMenuDropdownPosition.value.left}px`,
  minWidth: `${Math.max(280, addMenuDropdownPosition.value.minWidth)}px`,
}))
function updateAddMenuDropdownPosition() {
  const el = addMenuTriggerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const gap = 4
  const maxHeight = Math.min(window.innerHeight * 0.7, 400)
  const panelMinWidth = 320
  let left = rect.left
  let top = rect.bottom + gap
  if (left + panelMinWidth > window.innerWidth) left = window.innerWidth - panelMinWidth - 8
  if (left < 8) left = 8
  if (top + maxHeight > window.innerHeight - 8) top = Math.max(8, rect.top - maxHeight - gap)
  addMenuDropdownPosition.value = {
    top,
    left,
    minWidth: Math.min(rect.width, window.innerWidth - 16),
  }
}
function toggleAddMenuDropdown() {
  addMenuDropdownOpen.value = !addMenuDropdownOpen.value
  if (addMenuDropdownOpen.value) {
    nextTick(() => updateAddMenuDropdownPosition())
  }
}
function addBestSellingFromMenu(name: string) {
  if (!name) return
  bestSellingForm.value.items.push({ name })
  addMenuDropdownOpen.value = false
}
function closeAddMenuDropdown() {
  addMenuDropdownOpen.value = false
}
watch(addMenuDropdownOpen, (open) => {
  if (open) {
    nextTick(() => updateAddMenuDropdownPosition())
    document.addEventListener('keydown', onAddMenuEscape)
  } else {
    document.removeEventListener('keydown', onAddMenuEscape)
  }
})
function onAddMenuEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') closeAddMenuDropdown()
}

function buildMapEmbedUrl(location: string): string {
  if (!location?.trim()) return ''
  return `https://www.google.com/maps?q=${encodeURIComponent(location.trim())}&output=embed`
}

function saveContactSection() {
  const map = { ...contactForm.value.map }
  map.embedUrl = buildMapEmbedUrl(map.location)
  contactForm.value.map.embedUrl = map.embedUrl
  const payload = { ...contactForm.value, map }
  saveSection('contact', payload)
}

const { log: logActivity } = useActivityLog()

async function saveSection(section: string, payload: unknown) {
  saveMessage.value = ''
  try {
    await $fetch('/api/site-content', { method: 'PUT', body: { [section]: payload } })
    saveSuccess.value = true
    saveMessage.value = 'Saved. Refresh the public site to see changes.'
    logActivity('Save site content', section)
    if (section === 'contact') {
      await refreshNuxtData('site-content')
    }
  } catch (e) {
    saveSuccess.value = false
    saveMessage.value = e instanceof Error ? e.message : 'Save failed.'
  }
}

onMounted(loadContent)
</script>

<style scoped>
.content-form {
  @apply space-y-0 flex flex-col items-center;
}
.content-card {
  @apply w-full max-w-3xl mx-auto bg-palette-white rounded-2xl border border-palette-olive/15 shadow-md;
  overflow: visible;
}
.content-heading {
  font-family: Fraunces, Georgia, serif;
  @apply text-xl font-bold text-palette-brown px-6 pt-6 pb-0;
}
.content-sub {
  @apply text-sm text-palette-brown/70 px-6 pb-5 pt-1 border-b border-palette-olive/10;
}
.content-section {
  @apply px-6 py-5 border-b border-palette-olive/10 last:border-b-0 bg-palette-white;
}
.content-section:nth-child(even) {
  @apply bg-palette-cream/20;
}
.content-section-title {
  @apply text-xs font-semibold uppercase tracking-wider text-palette-brown/80 mb-4 flex items-center gap-2;
}
.content-section-title::before {
  content: '';
  @apply h-px flex-1 max-w-[2rem] bg-palette-sage/50;
}
.form-field {
  @apply mb-4 last:mb-0;
}
.form-label {
  @apply block text-sm font-medium text-palette-brown mb-1.5;
}
.form-hint {
  @apply text-xs text-palette-brown/60 mb-1;
}
.form-input {
  @apply w-full px-3 py-2.5 text-sm border border-palette-olive/25 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage transition-colors;
}
/* Native select dropdowns (excludes custom "Select a menu item" which is a button): consistent padding and appearance */
select.form-input {
  min-height: 2.625rem;
  padding: 0.625rem 2.25rem 0.625rem 0.75rem;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%237B7557' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.25rem 1.25rem;
  padding-right: 2.25rem;
}
select.form-input:focus {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2369AC7C' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
}
.form-input-sm {
  @apply py-2 text-sm rounded-lg;
}
.form-actions {
  @apply px-6 py-5 bg-palette-olive/5 border-t border-palette-olive/15;
}
.btn-primary {
  @apply inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-palette-sage text-white text-sm font-semibold rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-palette-sage/50 focus:ring-offset-2 transition-opacity shadow-sm;
}
.btn-secondary {
  @apply inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-palette-sage border border-palette-sage/50 rounded-xl hover:bg-palette-sage/10 focus:outline-none focus:ring-2 focus:ring-palette-sage/30 transition-colors;
}
.item-block {
  @apply p-4 mb-4 rounded-xl border border-palette-olive/15 bg-palette-cream/25 last:mb-0 shadow-sm;
}
.item-block-header {
  @apply flex justify-between items-center mb-3 pb-2 border-b border-palette-olive/10;
}
.item-block-header span {
  @apply text-sm font-medium text-palette-brown;
}
.item-remove {
  @apply text-sm text-red-600 hover:text-red-700 hover:underline focus:outline-none rounded px-1 -mx-1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.content-tab-btn {
  -webkit-tap-highlight-color: transparent;
}
.content-tab-btn:active {
  transform: none;
}
</style>
