import { mapActions, mapState } from 'vuex'
import debounce from 'debounce'
import { Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
import PanResizer from '@/components/PanResizer.vue'
import CompiledCodeSwitcher from '@/components/CompiledCodeSwitcher.vue'
import createEditor from '@/utils/create-editor'
import Event from '@/utils/event'
import panPosition from '@/utils/pan-position'
import { hasNextPan, getHumanlizedTransformerName, getEditorModeByTransfomer } from '@/utils'


export default ({ name, editor, components } = {}) => {
  return {
    name: `${name}-pan`,
    data() {
      return {
        style: {},
      }
    },
    computed: {
      ...mapState([name, 'visiblePans', 'activePan', 'autoRun','socketId']),
      ...mapState({
        isVisible: state => state.visiblePans.indexOf(name) !== -1
      }),
      enableResizer() {
        return hasNextPan(this.visiblePans, name)
      },
      isActivePan() {
        return this.activePan === name
      },
      humanlizedTransformerName() {
        return getHumanlizedTransformerName(this[name].transformer)
      }
    },
    watch: {
      isVisible() {
        this.editor.refresh()
      },
      visiblePans: {
        immediate: true,
        handler(val) {
          this.style = panPosition(val, name)
        }
      },
      [`${name}.transformer`](val) {
        const mode = getEditorModeByTransfomer(val)
        this.editor.setOption('mode', mode)
      },
      [`${name}.code`]() {
        // this.editor.focus()
        let code = this[name].code;
        if (code === this.localCode) return;

        this.editor.setValue(code)
        // this.editor.setCursor({line: 1, ch: 5})
        this.editor.setCursor(this[name].position);

        if (this.autoRun) {
          this.debounceRunCode()
        }
      }
    },
    mounted() {
      this.editor = createEditor(this.$refs.editor, {
        ...editor,
        readOnly: 'readonly' in this.$route.query
      })
      this.editor.on('change', (e, t) => {
        
        if (t.origin === 'setValue') return;
        // this.localCode = e.getValue();
        let id = this.socketId;
        this.updateCode({ code: e.getValue(), type: name,position: e.getCursor() })
        this.editorChanged()
        this.setSenderId(id);
        this.debounceEmitCode(this);

        // this.editor.focus()
        if (this.autoRun) {
          this.debounceRunCode()
        }
      
      })
      this.editor.on('focus', () => {
        if (this.activePan !== name && this.visiblePans.indexOf(name) > -1) {
          this.setActivePan(name)
        }
      })
      Event.$on('refresh-editor', () => {
        this.editor.setValue(this[name].code)
        this.editor.refresh()
      })
      // Focus the editor
      // This is usually emitted after setting boilerplate or gist
      Event.$on('focus-editor', active => {
        if (active === name) {
          this.editor.focus()
        }
      })
      Event.$on(`set-${name}-pan-style`, style => {
        this.style = {
          ...this.style,
          ...style
        }
      })
    },
    methods: {
      ...mapActions(['updateCode', 'updateTransformer', 'setActivePan', 'editorChanged','setSenderId']),
      async setTransformer(transformer) {
        await this.updateTransformer({ type: name, transformer })
      },
      updateSize() {
        // this.updateVuexSize(this.size);
        this.debounceEmitCode('1');
      },
      debounceEmitCode: debounce((_that) => {
        _that.$socket.emit('all', {
          settings: {
            js: _that.$store.state.js,
            html: _that.$store.state.html,
            css: _that.$store.state.css,
          },
          id: _that.$store.state.socketId
        });
      }, 500),
      debounceRunCode: debounce(() => {
        Event.$emit('run');
        // _that.$socket.emit(name, {
        //   code: _that.localCode
        // });
      }, 500)
    },

    components: {
      'el-dropdown': Dropdown,
      'el-dropdown-menu': DropdownMenu,
      'el-dropdown-item': DropdownItem,
      PanResizer,
      CompiledCodeSwitcher,
      ...components
    }
  }
}
