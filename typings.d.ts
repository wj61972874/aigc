declare module "*.css";
declare module "*.less";
declare module "*.scss";
declare module "*.png";
declare module "*.gif";
declare module "*.svg";

declare module "classnames";
declare module "lodash";



interface Window {
    wx: any;
  }
  
//   import { WeAppLaunchData } from 'open-data-view/open-data-view.type';

// interface WxOpenLaunchWeAppProps {
//   appid: string;
//   extinfo?: string;
//   path: string;
//   onLaunch?: (e: { detail: WeAppLaunchData }) => void;
//   onError?: (e: { detail: { errMsg: string } }) => void;
// }

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       'wx-open-launch-weapp': WxOpenLaunchWeAppProps;
//     }
//   }
// }

declare namespace JSX {
    interface IntrinsicElements {
      'wx-open-launch-weapp': any;
    }
  }