import React from 'react';
const config = {childList: true, subtree: false, attributes: false, }

const useMutationObserver = (targetEls:HTMLElement[], cb:MutationCallback) => {
  const [observers, setObservers] = React.useState<MutationObserver[]>([]);

  React.useEffect(() => {
    if (observers.length < 1) {
      targetEls.forEach(v=>{
        const obs = new MutationObserver(cb);
        obs.observe(v, config)
        setObservers(observers=>[...observers, obs])
      })
    }
    return () => {
      observers.forEach(v=>v.disconnect())
      setObservers([])
    };
  }, [targetEls]);
}
export default useMutationObserver