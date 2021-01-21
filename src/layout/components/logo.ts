import { h } from 'vue'
import xinzhou from '../../assets/menu/logo-xinzhou.png';
import sike from '../../assets/menu/logo-sike.png';
import logo from '../../assets/menu/logo.png';
import jinbang from '../../assets/menu/logo-jinbang.png';

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
      src: `${props.isSike ? sike : props.isXinzhou ? xinzhou : props.isJinbang ? jinbang : logo}`,
      alt: 'logo'
    })
  ])
}

export default menuLogo
