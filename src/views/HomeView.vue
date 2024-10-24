<template>
  <main class="flex h-screen w-screen items-center justify-center">
    <div class="w-[345px]">
      <div>
        <h3>Permission: {{ permissionStatusLabel }}</h3>
        <h3>Capability: {{ capabilityStatusLabel }}</h3>
        <h3>Recording: {{ ongoingRecordingStatusLabel }}</h3>
      </div>

      <h3 class="text-bold mb-2 text-4xl">Record</h3>
      <div class="flex gap-4">
        <button
          :disabled="isRecording"
          class="btn border-green-600 bg-green-100 text-green-600"
          @click="onStartRecording"
        >
          <PlayIcon class="size-10" />
        </button>

        <button
          :disabled="!isRecording"
          class="btn border-yellow-600 bg-yellow-100 text-yellow-600"
          @click="!isOnPause ? onPauseRecording() : onResumeRecording()"
        >
          <PlayPauseIcon class="size-10" />
        </button>

        <button
          :disabled="!isRecording"
          class="btn border-red-600 bg-red-100 text-red-600"
          @click="onStopRecording"
        >
          <StopIcon class="size-10" />
        </button>
      </div>

      <template v-if="audioSrc">
        <h3 class="text-bold mb-2 mt-24 text-4xl">Play record</h3>
        <audio v-if="audioSrc" controls :src="audioSrc"></audio>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { toaster } from '@/utils/toaster'
import { PlayIcon, PlayPauseIcon, StopIcon } from '@heroicons/vue/24/solid'
import { Capacitor } from '@capacitor/core'
import { VoiceRecorder } from 'capacitor-voice-recorder'

const isMobile = ref(false)
const isRecording = ref(false)
const isOnPause = ref(false)

const permissionStatusLabel = ref('')
const capabilityStatusLabel = ref('')
const ongoingRecordingStatusLabel = ref('')

const result = ref<any>(null)
const audioSrc = computed(() => {
  if (!result.value) return null
  // Create a data URL from the base64 string and mimeType
  return `data:${result.value.mimeType};base64,${result.value.recordDataBase64}`
})

onMounted(() => {
  isMobile.value = checkMobilePlatform()

  _updatePermissionStatusLabel()
  _updateRecordCapabilityLabel()
  _updateOngoingRecordingStatus()
})

function checkMobilePlatform() {
  return (
    Capacitor.isNativePlatform() &&
    (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios')
  )
}

/** Recording */
async function onStartRecording() {
  // if (!isMobile.value) {
  //   toaster.warn('Device is not mobile')
  //   return
  // }
  result.value = null
  await VoiceRecorder.requestAudioRecordingPermission().then(() => _updatePermissionStatusLabel())
  await VoiceRecorder.startRecording()
    .then(_onPromiseResolved('start'))
    .catch(_onPromiseThrown('start'))
  isRecording.value = true
}

async function onPauseRecording() {
  await VoiceRecorder.pauseRecording()
    .then(_onPromiseResolved('pause'))
    .catch(_onPromiseThrown('pause'))
  isOnPause.value = true
}
async function onResumeRecording() {
  await VoiceRecorder.resumeRecording()
    .then(_onPromiseResolved('resume'))
    .catch(_onPromiseThrown('resume'))
  isOnPause.value = false
}
async function onStopRecording() {
  // @ts-expect-error
  const res = await VoiceRecorder.stopRecording(_onPromiseResolved('stop')).catch(
    _onPromiseThrown('stop')
  )

  result.value = res?.value || null
  console.log(res?.value)
  isRecording.value = false
  isOnPause.value = false
}

/** Playing */
// function onStartPlaying() {}

/** Helpers */
function _onPromiseResolved(operation: string) {
  return async (result?: any) => {
    if (!result.value) {
      toaster.error(`Failed to ${operation} recording`)
    }
    await _updateOngoingRecordingStatus()

    return result
  }
}

function _onPromiseThrown(operation: string) {
  return async (error?: any) => {
    toaster.error(`Failed to ${operation} recording`, error)
    await _updateOngoingRecordingStatus()
    isRecording.value = false
    isOnPause.value = false
  }
}

function _updatePermissionStatusLabel() {
  VoiceRecorder.hasAudioRecordingPermission().then((result) => {
    permissionStatusLabel.value = result.value ? 'Granted' : 'Not Granted'
  })
}

function _updateRecordCapabilityLabel() {
  VoiceRecorder.canDeviceVoiceRecord().then((result) => {
    capabilityStatusLabel.value = result.value ? 'Can' : 'Cannot'
  })
}

async function _updateOngoingRecordingStatus() {
  await VoiceRecorder.getCurrentStatus().then((result) => {
    ongoingRecordingStatusLabel.value = result.status || 'Unknown'
  })
}
</script>
