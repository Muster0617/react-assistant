import { useState } from 'react';
import { Map, Marker } from 'react-amap';
// import axios from 'UTILS/axios';
import styles from './index.less';

// 参考文档
//高德地图API示例 https://lbs.amap.com/api/javascript-api/example/map/click-to-get-lnglat/
// react-amap的接口文档：https://github.com/ElemeFE/react-amap/blob/next/components/map/index.md
// 10009报错：https://blog.csdn.net/m0_37355951/article/details/77775287

// 【所实现功能】
// 搜索定位+点击地图上某点后，名称回显到input框
const mapKey = '9a1b9c68c850e9c9ebe6f8bdc7a84d61';
let myMarkerInstance = null;
let myMapInstance = null;
// const markerPosition = { longitude: 120, latitude: 35 };

export default () => {
  const [inputValue, setInputValue] = useState('');
  const [markerPosition, setMarkerPosition] = useState({ longitude: 120, latitude: 35 });

  const amapEvents = {
    created: (mapInstance) => {
      console.log('高德地图 Map 实例创建成功');
      console.log('缩放级别：', mapInstance.getZoom());
      myMapInstance = mapInstance;

      // 搜索定位
      AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.CitySearch'], () => {
        //eslint-disable-line
        // 实例化Autocomplete
        const autoOptions = {
          // input 为绑定输入提示功能的input的DOM ID
          input: 'amapInput',
        };
        const autoComplete = new AMap.Autocomplete(autoOptions); //eslint-disable-line
        // 无需再手动执行search方法，autoComplete会根据传入input对应的DOM动态触发search

        const placeSearch = new AMap.PlaceSearch({
          //eslint-disable-line
          map: mapInstance,
        });

        // 注册监听，监听下拉框选中事件
        AMap.event.addListener(autoComplete, 'select', (e) => {
          // eslint-disable-line
          // TODO 针对选中的poi实现自己的功能
          console.log('e:', e);
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name);
        });

        const citySearch = new AMap.CitySearch(); //eslint-disable-line
        citySearch.getLocalCity((status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            // 查询成功，result即为当前所在城市信息
            if (result && result.city && result.bounds) {
              // 当前城市名称
              const cityinfo = result.city;

              // 当前城市位置信息
              const citybounds = result.bounds;
              document.getElementById('info').innerHTML = '您当前所在城市：' + cityinfo;

              // 地图显示当前城市
              mapInstance.setBounds(citybounds);
              // 需要在设置坐标成功后，重新设置 缩放级别
              //   mapInstance.setZoom(15)
            }
          }
        });
      });

      // 点击实例地点，在input输入框回显地点名字
      mapInstance.on('click', (e) => {
        const lngLat = `${e.lnglat.getLat()},${e.lnglat.getLng()}`;
        console.log('坐标位置:', lngLat);
        console.log(myMapInstance, 'mapInstance--');
        // mapInstance.setCenter([e.lnglat.lat, e.lnglat.lng]); //设置地图中心点
        setMarkerPosition({ longitude: e.lnglat.lng, latitude: e.lnglat.lat });
        AMap.plugin('AMap.Geocoder', function () {
          //eslint-disable-line
          const geocoder = new AMap.Geocoder({}); //eslint-disable-line
          geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], (status, result) => {
            console.log('status, result:', status, result);
            if (status === 'complete' && result.info === 'OK') {
              console.log(result.regeocode.formattedAddress);
              setInputValue(result.regeocode.formattedAddress);
            }
          });
        });
      });
    },
  };
  const markerEvents = {
    created: (markerInstance) => {
      console.log(
        '高德地图 Marker 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：',
      );
      console.log('1111', markerInstance.getPosition());

      myMarkerInstance = markerInstance;
    },
  };

  return (
    <div>
      <div className={styles.infoBox}>
        <span className={styles.inputText}>请输入关键字:</span>
        <input
          id="amapInput"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={styles.input}
          type="text"
        />
      </div>
      <div id="info" style={{ marginBottom: 10, fontSize: 14 }} />
      <div style={{ width: '100%', height: '600px', position: 'relative' }}>
        <Map
          zoom={15}
          plugins={['ToolBar']}
          events={amapEvents}
          amapkey={mapKey}
          center={markerPosition}
        >
          <Marker position={markerPosition} events={markerEvents} />
        </Map>
      </div>
    </div>
  );
};
