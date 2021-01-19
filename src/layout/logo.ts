import { h } from 'vue'

const menuLogo = (props, context) => {
  return h('div', {
    class: {
      'logo-xinzhou': props.isSike || props.isXinzhou || props.isJinbang,
      'logo' : !props.isXinzhou && !props.isSike && !props.isJinbang
    },
    style: {
      height: props.isSike ? "90px" : '',
    }
  }, [
    h('img',{
      src: `${props.isSike ? '../assets/menu/logo-sike.png' : props.isXinzhou ? '../assets/menu/logo-xinzhou.png' : props.isJinbang ? '../src/assets/menu/logo-jinbang.png' : '../src/assets/menu/logo.png'}`,
      alt: 'logo'
    })
  ])
}

export default menuLogo
