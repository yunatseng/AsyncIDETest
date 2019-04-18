<template>
  <div
    class="html-pan"
    :class="{ 'active-pan': isActivePan }"
    @click="setActivePan('html')"
    :style="style">
    <div class="pan-head">
      <el-dropdown @command="setTransformer" trigger="click">
        <span class="el-dropdown-link">
          {{ humanlizedTransformerName }} <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="html">HTML</el-dropdown-item>
          <el-dropdown-item command="pug">Pug</el-dropdown-item>
          <el-dropdown-item command="markdown">Markdown</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div>
        <el-button
          border
          size="mini"
          v-if="$route.params.who === 'teacher'"
          @click="setFontSize('add')">+</el-button>
        <el-button
          border
          size="mini"
          v-if="$route.params.who === 'teacher'"
          @click="setFontSize('minus')">-</el-button>
        <compiled-code-switcher type="html" v-if="html.code"></compiled-code-switcher>
      </div>
    </div>
    <textarea ref="editor">{{ html.code }}</textarea>
    <pan-resizer pan="html" :enable="enableResizer" />
  </div>
</template>

<script>
  import createPan from '@/utils/create-pan'

  export default createPan({
    name: 'html',
    editor: {
      mode: 'htmlmixed',
      autoCloseTags: true
    },
  })
</script>
