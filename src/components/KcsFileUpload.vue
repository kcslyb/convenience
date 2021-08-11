<template>
  <div class="attachment-info">
    <span class="attachment-info-label">
      <span>{{label}}</span>
      <van-checkbox
        shape="square"
        v-model="checked"
        icon-size="1.6rem"
        class="checkbox-ph"
        v-if="osType==='1' && !showInfo">使用手机拍照</van-checkbox>
    </span>
    <div class="attachment-info-image" id="upLoadInput" v-show="!showInfo">
      <van-uploader
        v-show="!showInfo"
        multiple
        :accept="accept"
        v-model="imgList"
        style="width: 100%"
        :after-read="afterRead"
        :max-size="1024 * 1024 * fileSize"
        :max-count="maxCount"
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
    <div class="attachment-info-image" v-show="showInfo && imgList.length > 0">
      <van-image
        @click="imagePreview(file,index)"
        width="8rem"
        height="8rem"
        v-for="(file, index) of imgList"
        :key="'file_' + index"
        :src="file.base64"
      />
    </div>
    <div v-if="otherList.length > 0">
      <van-cell
        :title="item.name"
        style="font-size: 1.4rem"
        :key="`other-file-${index}`"
        v-for="(item, index) in otherList">
        <template slot="title">
          <span @click="handleDownload(item)">{{item.name}}</span>
        </template>
        <template slot="right-icon">
          <van-icon name="delete" v-show="!showInfo" color="#6E7D93" size="20" @click="fileListDelete(item)"/>
        </template>
      </van-cell>
    </div>
    <div v-show="showInfo && imgList.length === 0 && otherList.length === 0" style="text-align: center; width: 100%">
      <span>无附件</span>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const imageConversion = require('image-conversion')
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
    accept: {
      type: String,
      default: 'image/*'
    },
    maxCount: {
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
      default: 8
    },
    fileTotalSize: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      osType: '1',
      checked: false,
      imgList: [],
      otherList: [],
      fileList: []
    }
  },
  computed: {
    fileIdStr () {
      return this.fileIds.join(',')
    }
  },
  watch: {
    fileIdStr (val, old) {
      if (val !== old) {
        this.initData()
      }
    },
    checked () {
      this.domAddCapture()
    }
  },
  mounted () {
    this.initData()
    this.$nextTick(() => {
      this.domAddCapture()
    })
  },
  methods: {
    initData () {
      if (this.fileIds.length > 0) {
        this.getImageBase64(this.fileIds)
      } else {
        this.imgList = []
        this.fileList = []
        this.otherList = []
      }
      // 判断设备ios / 安卓
      this.osType = localStorage.getItem('osType')
    },
    // 动态设置capture属性
    domAddCapture () {
      const inputEle = document.querySelector('#upLoadInput' +
        ' .van-uploader .van-uploader__wrapper .van-uploader__upload .van-uploader__input')
      if (inputEle) {
        if (this.checked) {
          inputEle.setAttribute('capture', 'capture')
        } else {
          inputEle.removeAttribute('capture')
        }
      }
    },
    // 图片上传
    afterRead (file) {
      console.info(file)
      if (this.isCheckFormat) {
        const fileType = file.file.name.substring(file.file.name.lastIndexOf('.') + 1)
        if (!this.fileFormat.includes(fileType)) {
          this.$notify({
            message: '不支持上传该文件格式',
            type: 'warning'
          })
          this.imgList.pop()
          return false
        }
      }
      let totalSize = file.file.size
      this.fileList.forEach(value => {
        totalSize += Number(value.size)
      })
      console.info(totalSize)
      console.info(1024 * 1024 * this.fileTotalSize)
      if (totalSize > 1024 * 1024 * this.fileTotalSize) {
        this.$notify({
          message: `文件总大小不能超过${this.fileTotalSize}M`,
          type: 'warning'
        })
        this.imgList.pop()
        return false
      }
      if (file.file.size > 1024 * 1024 * this.fileSize) {
        this.$notify({
          message: `文件大小不能超过${this.fileSize}M`,
          type: 'warning'
        })
        this.imgList.pop()
        return false
      }
      imageConversion.compressAccurately(file.file, 1000).then(res => {
        if (!res.name) {
          const resultFile = new File([res], file.file.name, { type: res.type, lastModified: Date.now() })
          this.handleUpload(resultFile)
        } else {
          this.handleUpload(file.file)
        }
      })
    },
    handleUpload (file) {
      const fromData = new FormData()
      fromData.append('files', file.file)
      this.$service.post('/base/oss/batchUploadFile', fromData).then(res => {
        if (res.code === 200) {
          this.fileList = this.fileList.concat(res.data)
          if (!this.isImage(res.data[0])) {
            this.imgList.pop()
            this.otherList.push(res.data[0])
          }
          this.$emit('on-file-change', this.fileList)
        } else {
          this.$notify({
            message: res.msg || '上传错误，请稍后再试',
            type: 'warning'
          })
          this.imgList.pop()
        }
        if (this.osType === '1' && !this.showInfo) {
          this.$nextTick(() => {
            this.domAddCapture()
          })
        }
      })
    },
    fileListDelete (file) {
      // 删除显示的数据
      const temp2 = this.otherList.filter(value => file.id !== value.id)
      const length2 = this.otherList.length
      this.otherList.splice(0, length2, ...temp2)
      // todo: 缺少删除文件接口
      const temp = this.fileList.filter(value => file.id !== value.id)
      const length = this.fileList.length
      this.fileList.splice(0, length, ...temp)
      this.$emit('on-file-change', this.fileList)
      if (this.osType === '1' && !this.showInfo) {
        this.$nextTick(() => {
          this.domAddCapture()
        })
      }
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
          this.otherList = []
          this.fileList = this.fileList.concat(res.data)
          this.fileList.forEach(value => {
            const rg = /\.([\w]+)$/
            const imgType = ['JPG', 'JPEG', 'jpg', 'jpeg', 'png']
            const type = value.name.match(rg)[1]
            if (imgType.includes(type)) {
              value.content = value.base64
              this.imgList.push(value)
            } else {
              this.otherList.push(value)
            }
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
    },
    handleDownload (item) {
      console.info(item)
      // const action = this.toPms ? 'pmsFileDown' : 'FileDown'
      // OssApi[action]({ fileId: item.id, serviceType: '1' }).then(res => {
      //   const a = document.createElement('a')
      //   // ArrayBuffer 转为 Blob
      //   const rg = /\.([\w]+)$/
      //   const imgType = ['JPG', 'JPEG', 'jpg', 'jpeg', 'png']
      //   const type = item.name.match(rg)[1]
      //   const optionsType = imgType.includes(type) ? `images/${type}` : `application/${type}`
      //   const blob = new Blob([res], { type: optionsType })
      //   const objectUrl = URL.createObjectURL(blob)
      //   a.setAttribute('href', objectUrl)
      //   a.setAttribute('download', item.name)
      //   a.click()
      //   a.remove()
      // })
    },
    isImage (file) {
      const rg = /\.([\w]+)$/
      const imgType = ['JPG', 'JPEG', 'jpg', 'jpeg', 'png']
      const type = file.name.match(rg)[1]
      return imgType.indexOf(type) > -1
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
  padding-top: 1rem;
  background: #fff;
  .attachment-info-label {
    padding-left: 1.6rem;
    color: #6E7D93;
    font-size: 1.4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .checkbox-ph {
      padding-right: 1.6rem;
    }
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
    /deep/ .van-image__loading-icon {
      display: none;
    }
    .van-uploader {
      margin-left: 1rem;
      border-radius: 1rem;
    }
  }
}
</style>
