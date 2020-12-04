<template>
  <div class="attachment-info">
    <span class="attachment-info-label">{{label}}</span>
    <div class="attachment-info-image">
      <van-uploader
        v-show="!showInfo"
        multiple
        accept="image/*"
        v-model="imgList"
        style="width: 100%"
        :after-read="afterRead"
        :max-size="1024 * 1024 * maxSize"
        @delete="fileListDelete"
        @oversize="onOversize">
        <template #preview-cover="{ file }">
          <van-image
            @click="imagePreview(file,index)"
            :src="file ? file.url : ''"
          />
        </template>
      </van-uploader>
    </div>
    <div class="attachment-info-image" v-show="showInfo">
      <van-image
        @click="imagePreview(file,index)"
        width="8rem"
        height="8rem"
        v-for="(file, index) of imgList"
        :key="'file_' + index"
        :src="file.base64"
      />
      <div v-show="imgList.length === 0" style="text-align: center; width: 100%">
        <van-empty description="无附件" />
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
export default {
  name: 'KcsFileUpload',
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component
  },
  props: {
    label: {
      type: String,
      default: '附件'
    },
    maxSize: {
      type: Number,
      default: 10
    },
    showInfo: {
      type: Boolean,
      default: false
    },
    fileIds: {
      type: Array,
      default: () => []
    },
    fileFormat: {
      type: Array,
      default: () => {
        return ['JPG', 'JPEG', 'jpg', 'jpeg', 'png']
      }
    },
    isCheckFormat: {
      type: Boolean,
      default: true
    },
    fileSize: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      imgList: [],
      fileList: []
    }
  },
  watch: {
    fileIds: {
      handler () {
        this.initData()
      }
    },
    deep: true
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      if (this.fileIds.length > 0) {
        this.getImageBase64(this.fileIds)
      } else {
        this.imgList = []
        this.fileList = []
      }
    },
    // 图片上传
    afterRead (file) {
      console.info(file)
      if (this.isCheckFormat) {
        const fileType = file.file.name.substring(file.file.name.lastIndexOf('.') + 1)
        if (!this.fileFormat.includes(fileType)) {
          this.$notify({
            message: '只能上传图片类型文件',
            type: 'warning'
          })
          this.imgList.pop()
          return false
        }
      }
      if (file.file.size > 1024 * 1024 * this.fileSize) {
        this.$notify({
          message: `文件大小不能超过${this.fileSize}M`,
          type: 'warning'
        })
        this.imgList.pop()
        return false
      }
      const fromData = new FormData()
      fromData.append('files', file.file)
      this.$service.post('/base/oss/batchUploadFile', fromData).then(res => {
        if (res.code === 200) {
          this.fileList = this.fileList.concat(res.data)
          this.$emit('on-file-change', this.fileList)
        } else {
          this.$notify({
            message: res.msg || '上传错误，请稍后再试',
            type: 'warning'
          })
          this.imgList.pop()
        }
      })
    },
    fileListDelete (file) {
      // todo: 缺少删除文件接口
      const temp = this.fileList.filter(value => file.id !== value.id)
      const length = this.fileList.length
      this.fileList.splice(0, length, ...temp)
      this.$emit('on-file-change', this.fileList)
    },
    onOversize () {
      this.$notify({
        type: 'warning',
        message: `文件大小不能超过${this.fileSize}M`
      })
    },
    getImageBase64 (fileIds) {
      this.$service.post('/base/oss/getLocalImageBase64', fileIds).then(res => {
        if (res.code === 200) {
          this.imgList = []
          this.fileList = []
          this.fileList = this.fileList.concat(res.data)
          this.imgList = this.imgList.concat(res.data)
          this.imgList.map(val => {
            val.content = val.base64
          })
        }
      }).catch((e) => {
        throw Error(`NcFile: 查询图片Base64错误 ${e}`)
      })
    },
    imagePreview (v) {
      if (v) {
        const images = []
        this.imgList.forEach(value => images.push(value.base64))
        const index = this.imgList.findIndex(value => value.id === v.id)
        ImagePreview({
          images: images,
          startPosition: index
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
  /deep/.van-uploader__input-wrapper {
    position: relative;
    width: 100%;
  }
  .attachment-info {
    background: #fff;
    .attachment-info-label {
      padding-left: 1.6rem;
      color: #6E7D93;
      font-size: 1.4rem;
    }

    .attachment-info-image {
      padding: 1.5rem 1rem;
      display: flex;
      flex-wrap: wrap;
      border-radius: .5rem;
      box-shadow: 2px 2px 8px 2px #F4F8FC;

      /deep/ .van-image__error-icon {
        display: none;
      }
      .van-uploader {
        margin-left: 1rem;
        border-radius: 1rem;
      }
    }
  }
</style>
