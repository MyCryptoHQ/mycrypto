import React from 'react';
import translate, { translateMd } from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconFive from 'assets/images/onboarding/slide-05.svg';

const WhySlide = () => {
  const header = translate('ONBOARD_WHY_TITLE');

  const content = (
    <div>
      <h5>{translateMd('ONBOARD_WHY_CONTENT__1')}</h5>
      <ul>
        <li className="text-danger">{translateMd('ONBOARD_WHY_CONTENT__2')}</li>
        <li className="text-danger">{translateMd('ONBOARD_WHY_CONTENT__3')}</li>
        <li className="text-danger">{translateMd('ONBOARD_WHY_CONTENT__4')}</li>
        <li className="text-danger">{translateMd('ONBOARD_WHY_CONTENT__5')}</li>
        <li className="text-danger">{translateMd('ONBOARD_WHY_CONTENT__6')}</li>
      </ul>
      <h5>{translateMd('ONBOARD_WHY_CONTENT__7')}</h5>
      <ul>
        <li>{translateMd('ONBOARD_WHY_CONTENT__8')}</li>
        <li>{translateMd('ONBOARD_WHY_CONTENT__9')}</li>
        <li>{translateMd('ONBOARD_WHY_CONTENT__10')}</li>
      </ul>
    </div>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconFive} imageSide="left" />
  );
};

export default WhySlide;
