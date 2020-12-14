export default () => {
  import.meta.env.MODE !== 'development' && (console.log = console.dir = console.info = () => {});
}