/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';

type Props = Readonly<{
  'data-test-id'?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  title?: string;
}>;

export default function Button({
  'data-test-id': dataTestId,
  children,
  className,
  disabled,
  onClick,
  title,
}: Props): JSX.Element {
  return (
    <button
      disabled={disabled}
      className={className}
      onClick={onClick}
      title={title}
      aria-label={title}
      {...(dataTestId && {'data-test-id': dataTestId})}>
      {children}
    </button>
  );
}
