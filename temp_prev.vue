<template>
  <div class="space-y-6">
    <PageHeader title="绀惧尯骞垮満" description="涓庡弽璇堝悓琛岃€呭垎浜粡楠屻€佽璁烘渚嬶紝鏋勫缓鍙俊璧栫殑鐭ヨ瘑绀惧尯" />

    <div v-if="auth.isAuthenticated && auth.user?.is_staff" class="flex justify-end">
      <Button @click="showCreateCommunityDialog = true">
        <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
        鍒涘缓鏂扮ぞ鍖?      </Button>
    </div>

    <section class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div class="space-y-4">
        <Card v-if="auth.isAuthenticated" class="border border-border/70 bg-secondary/30">
          <CardHeader>
            <CardTitle>鍙戣〃鏂板笘</CardTitle>
            <CardDescription>鍒嗕韩鏈€鏂扮殑闃查獥鎻愮ず鎴栨眰鍔╄璁?/CardDescription>
          </CardHeader>
          <CardContent>
            <form class="space-y-4" @submit.prevent="submitPost">
              <div class="grid gap-4">
                <div>
                  <Label for="title">甯栧瓙鏍囬</Label>
                  <Input id="title" v-model="postForm.title" placeholder="涓€鍙ヨ瘽鎬荤粨浣犵殑瑙傜偣" required />
                </div>
              </div>
              <div>
                <Label for="body">鍐呭</Label>
                <Textarea
                  id="body"
                  v-model="postForm.body"
                  rows="4"
                  placeholder="鍒嗕韩浣犵殑鍙嶈瘓缁忛獙銆侀闄╂彁绀烘垨姹傚姪闂"
                  required
                />
              </div>
              <div>
                <Label class="mb-1 block text-sm font-medium text-muted-foreground">涓婁紶鍥剧墖锛堝彲閫夛級</Label>
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  @change="handleFileChange"
                />
                <Button type="button" variant="outline" @click="triggerFileInput">
                  <Icon name="lucide:upload" class="mr-2 h-4 w-4" />
                  閫夋嫨鍥剧墖
                </Button>
                <p v-if="postForm.images.length" class="mt-2 text-xs text-muted-foreground">
                  宸查€夋嫨 {{ postForm.images.length }} 寮犲浘鐗?                </p>
              </div>
              <div class="flex items-center justify-end gap-3">
                <Button type="submit" :disabled="createLoading">
                  {{ createLoading ? '鍙戝竷涓€? : '鍙戝竷甯栧瓙' }}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card v-else class="border border-border/70 bg-muted/30">
          <CardHeader>
            <CardTitle>鐧诲綍鍚庡弬涓庤璁?/CardTitle>
            <CardDescription>鐧诲綍璐﹀彿鍗冲彲鍙戝笘銆佺偣璧炲拰璇勮</CardDescription>
          </CardHeader>
          <CardContent>
            <Button class="w-full" @click="navigateTo('/login')">鍓嶅線鐧诲綍</Button>
          </CardContent>
        </Card>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">绀惧尯鐑笘</h2>
            <Button variant="outline" size="sm" :disabled="feedLoading" @click="refreshPosts">
              <Icon name="lucide:refresh-cw" class="mr-1 h-4 w-4" />
              鍒锋柊
            </Button>
          </div>
          <div v-if="feedLoading && !posts.length" class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
            姝ｅ湪鍔犺浇绀惧尯鍐呭鈥?          </div>
          <div v-else-if="!posts.length" class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
            鏆傛棤甯栧瓙锛屾垚涓虹涓€浣嶅垎浜€呭惂锛?          </div>
          <div v-else class="space-y-4">
            <Card v-for="post in posts" :key="post.id" class="cursor-pointer border border-border/70 transition-colors hover:bg-muted/50" @click="goToPost(post.id, $event)">
              <CardHeader class="space-y-1">
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <div>
                    鍙戝竷浜?                    <NuxtLink :to="`/community/${post.community_detail.slug}`" class="font-medium text-foreground hover:underline">
                      {{ post.community_detail.name }}
                    </NuxtLink>
                  </div>
                  <span>{{ formatDate(post.created_at) }}</span>
                </div>
                <CardTitle class="text-xl">{{ post.title }}</CardTitle>
                <CardDescription>
                  <NuxtLink :to="`/users/${post.author.username}`" class="font-medium text-foreground hover:underline">
                    {{ post.author.nickname || post.author.username }}
                  </NuxtLink>
                  鍙戝竷
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <p class="whitespace-pre-line text-sm leading-relaxed">{{ post.body }}</p>
                <div v-if="post.images.length" class="grid gap-3 md:grid-cols-2">
                  <img
                    v-for="image in post.images"
                    :key="image.id"
                    :src="resolveMedia(image.image)"
                    class="h-48 w-full rounded-lg object-cover"
                    alt="甯栧瓙鍥剧墖"
                  />
                </div>
              </CardContent>
              <CardFooter class="flex items-center justify-between gap-4 text-sm">
                <div class="flex items-center gap-4 text-muted-foreground">
                  <button class="flex items-center gap-1" :class="post.is_liked ? 'text-primary' : ''" @click.stop="toggleLike(post)">
                    <Icon :name="post.is_liked ? 'lucide:heart' : 'lucide:heart-off'" class="h-4 w-4" />
                    <span>{{ post.like_count }}</span>
                  </button>
                  <div class="flex items-center gap-1">
                    <Icon name="lucide:message-square" class="h-4 w-4" />
                    <span>{{ post.comment_count }}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <div v-if="hasMore" class="flex justify-center">
              <Button variant="outline" :disabled="feedLoading" @click="loadMore">
                {{ feedLoading ? '鍔犺浇涓€? : '鍔犺浇鏇村' }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <aside class="space-y-4">
        <Card class="border border-border/70">
          <CardHeader>
            <CardTitle>鎺ㄨ崘鐑笘</CardTitle>
            <CardDescription>鐪嬬湅澶у閮藉湪璁ㄨ浠€涔?/CardDescription>
          </CardHeader>
          <CardContent class="space-y-3 text-sm">
            <div v-if="hotPostsLoading" class="text-muted-foreground">鍔犺浇涓€?/div>
            <div v-else-if="!hotPosts.length" class="text-muted-foreground">鏆傛棤鐑笘</div>
            <div v-else class="space-y-3">
              <div
                v-for="post in hotPosts"
                :key="post.id"
                class="rounded-lg border border-border/70 bg-background/80 p-3"
              >
                <NuxtLink :to="`/community/posts/${post.id}`" class="font-medium hover:underline">
                  {{ post.title }}
                </NuxtLink>
                <p class="mt-1 text-xs text-muted-foreground">
                  {{ post.like_count }} 浜虹偣璧?路 {{ post.comment_count }} 鏉¤瘎璁?                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card class="border border-border/70 bg-secondary/20">
          <CardHeader>
            <CardTitle>绀惧尯瀹堝垯</CardTitle>
            <CardDescription>鍏卞缓楂樿川閲忋€佸彲淇＄殑闃茶瘓绌洪棿</CardDescription>
          </CardHeader>
          <CardContent class="space-y-2 text-xs text-muted-foreground">
            <p>路 鍒嗕韩鐪熷疄鏈夋晥鐨勫弽璇堢粡楠屽拰妗堜緥锛岄伩鍏嶄紶鎾湭缁忛獙璇佺殑淇℃伅銆?/p>
            <p>路 灏婇噸鍏朵粬鐢ㄦ埛鐨勯殣绉侊紝涓嶅叕寮€涓汉鏁忔劅鏁版嵁銆?/p>
            <p>路 瀵瑰紓甯稿唴瀹逛娇鐢ㄤ妇鎶ユ垨鎻愰啋绀惧尯绠＄悊鍛樺鐞嗐€?/p>
          </CardContent>
        </Card>
      </aside>
    </section>
  </div>
    <Dialog v-model:open="showCreateCommunityDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>鍒涘缓鏂扮ぞ鍖?/DialogTitle>
          <DialogDescription>濉啓绀惧尯淇℃伅浠ュ垱寤轰竴涓柊鐨勫弽璇堢ぞ鍖恒€?/DialogDescription>
        </DialogHeader>
        <form class="grid gap-4 py-4" @submit.prevent="createCommunity">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="community-name" class="text-right">鍚嶇О</Label>
            <Input id="community-name" v-model="createCommunityForm.name" class="col-span-3" required />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="community-slug" class="text-right">Slug</Label>
            <Input id="community-slug" v-model="createCommunityForm.slug" class="col-span-3" required />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="community-description" class="text-right">鎻忚堪</Label>
            <Textarea id="community-description" v-model="createCommunityForm.description" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="community-private" class="text-right">绉佹湁绀惧尯</Label>
            <Switch id="community-private" v-model:checked="createCommunityForm.is_private" class="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit" :disabled="createCommunityLoading">
              {{ createCommunityLoading ? '鍒涘缓涓€? : '鍒涘缓绀惧尯' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import type { AxiosError } from 'axios'

interface CommunitySummary {
  id: number
  name: string
  slug: string
  description: string
  members_count: number
}

interface PostImage {
  id: number
  image: string
  order: number
}

interface PostAuthor {
  username: string
  nickname?: string | null
}

interface PostItem {
  id: number
  title: string
  body: string
  community: number
  community_detail: CommunitySummary & { current_role?: string | null; created_at?: string }
  author: PostAuthor
  images: PostImage[]
  created_at: string
  like_count: number
  comment_count: number
  is_liked: boolean
}

const { $api, $config } = useNuxtApp()
const auth = useAuthStore()

const hotPosts = ref<PostItem[]>([])
const hotPostsLoading = ref(true)
const posts = ref<PostItem[]>([])
const feedLoading = ref(false)
const currentPage = ref(1)
const hasMore = ref(false)
const createLoading = ref(false)
const showCreateCommunityDialog = ref(false)
const createCommunityLoading = ref(false)

const createCommunityForm = reactive({
  name: '',
  slug: '',
  description: '',
  is_private: false,
})

const createCommunity = async () => {
  createCommunityLoading.value = true
  try {
    await $api.post('/community/communities/', createCommunityForm)
    window.alert('绀惧尯鍒涘缓鎴愬姛锛?)
    showCreateCommunityDialog.value = false
    createCommunityForm.name = ''
    createCommunityForm.slug = ''
    createCommunityForm.description = ''
    createCommunityForm.is_private = false
    // 閲嶆柊鍔犺浇榛樿绀惧尯锛岀‘淇?postForm.community 琚缃?    await fetchDefaultCommunity()
  } catch (error) {
    console.error('鍒涘缓绀惧尯澶辫触', error)
    const axiosError = error as AxiosError<{ detail?: string }>
    window.alert(axiosError.response?.data?.detail || '鍒涘缓绀惧尯澶辫触锛岃绋嶅悗閲嶈瘯')
  } finally {
    createCommunityLoading.value = false
  }
}

const postForm = reactive({
  community: '',
  title: '',
  body: '',
  images: [] as File[],
})

const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const fetchDefaultCommunity = async () => {
  try {
    const { data } = await $api.get('/community/communities/', { params: { page_size: 1 } });
    const results = Array.isArray(data) ? data : data.results || [];
    if (results.length) {
      postForm.community = String(results[0].id);
    } else {
      window.alert('鏈壘鍒颁换浣曠ぞ鍖猴紝鏃犳硶鍙戝竷甯栧瓙銆傝鑱旂郴绠＄悊鍛樸€?);
      console.error('鏈壘鍒颁换浣曠ぞ鍖猴紝鏃犳硶鍙戝竷甯栧瓙銆?);
    }
  } catch (error) {
    console.error('鍔犺浇榛樿绀惧尯澶辫触', error);
  }
};

const fetchHotPosts = async () => {
  hotPostsLoading.value = true;
  try {
    const { data } = await $api.get('/community/posts/', { params: { ordering: '-like_count,-created_at', page_size: 5 } });
    hotPosts.value = Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error('鍔犺浇鐑笘澶辫触', error);
  } finally {
    hotPostsLoading.value = false;
  }
};

const fetchPosts = async (page = 1, append = false) => {
  feedLoading.value = true
  try {
    const { data } = await $api.get('/community/posts/', { params: { page } })
    const results = Array.isArray(data) ? data : data.results || []
    if (append) {
      posts.value = [...posts.value, ...results]
    } else {
      posts.value = results
    }
    hasMore.value = Boolean(data?.next)
    currentPage.value = page
  } catch (error) {
    console.error('鍔犺浇甯栧瓙澶辫触', error)
  } finally {
    feedLoading.value = false
  }
}

const refreshPosts = () => fetchPosts(1, false)

const loadMore = () => {
  if (feedLoading.value || !hasMore.value) return
  fetchPosts(currentPage.value + 1, true)
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  postForm.images = Array.from(target.files ?? [])
}

const submitPost = async () => {
  console.log('submitPost triggered');
  if (!postForm.title.trim() || !postForm.body.trim()) {
    window.alert('鏍囬鍜屽唴瀹逛笉鑳戒负绌恒€?);
    return;
  }
  createLoading.value = true
  try {
    const formData = new FormData()
    // 鍙湁褰?postForm.community 鏈夊€兼椂鎵嶅彂閫?community 瀛楁
    if (postForm.community) {
      formData.append('community', postForm.community)
    }
    formData.append('title', postForm.title)
    formData.append('body', postForm.body)
    postForm.images.forEach((file) => formData.append('images', file))
    await $api.post('/community/posts/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    window.alert('甯栧瓙宸插彂甯?)
    postForm.title = ''
    postForm.body = ''
    postForm.images = []
    await refreshPosts()
  } catch (error) {
    console.error('鍙戝竷甯栧瓙澶辫触', error)
    const axiosError = error as AxiosError<{ detail?: string }>
    window.alert(axiosError.response?.data?.detail || '鍙戝竷澶辫触锛岃绋嶅悗閲嶈瘯')
  } finally {
    createLoading.value = false
  }
}

const goToPost = (postId: number, event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.closest('a, button')) {
    return
  }
  navigateTo(`/community/posts/${postId}`)
}

const toggleLike = async (post: PostItem) => {
  if (!auth.isAuthenticated) {
    window.alert('璇峰厛鐧诲綍鍚庡啀鐐硅禐')
    return
  }
  try {
    const { data } = await $api.post(`/community/posts/${post.id}/like/`)
    post.is_liked = Boolean(data?.liked)
    if (typeof data?.like_count === 'number') {
      post.like_count = data.like_count
    }
  } catch (error) {
    console.error('鐐硅禐澶辫触', error)
  }
}

const resolveMedia = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = $config.public.apiBase?.replace(/\/$/, '') ?? ''
  return `${base}${path}`
}

const formatDate = (value: string) => {
  try {
    return new Date(value).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    return value
  }
}

onMounted(async () => {
  await fetchDefaultCommunity()
  await fetchHotPosts()
  await fetchPosts()
})
</script>
