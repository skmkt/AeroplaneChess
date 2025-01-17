/**
 * Created by Andrew on 2015/5/14.
 */
/**
 * 电脑
 * @constructor
 */
var Computer = function () {
    this.performing = function () {
        setTimeout(function () {
            var planeList = new Array();
            $j('.plane').each(function () {
                if (planeOption.currentUser == $j(this).attr('type') && $j(this).hasClass('pointer')) {
                    planeList.push($j(this));
                }
            });
            if (planeList && planeList.length > 0) {
                var selectedPlane;
                if (planeOption.difficulty === 'hard') {
                    selectedPlane = findBestAttackingPlane(planeList);
                } else if (planeOption.difficulty === 'easy') {
                    selectedPlane = findSafestPlane(planeList);
                } else {
                    // Medium difficulty - random selection
                    selectedPlane = planeList[obtainRandomNum(planeList.length)];
                }
                selectedPlane.click();
                if (diceNum == 6) {
                    diceClick();
                }
            }
        }, 1500);
    };

    /**
     * Finds the plane with the best attacking position (for hard difficulty)
     * @param planeList Array of eligible planes
     * @returns {jQuery} The best plane to move
     */
    function findBestAttackingPlane(planeList) {
        var bestScore = -1;
        var bestPlane = planeList[0];

        planeList.forEach(function(plane) {
            var score = evaluatePlanePosition(plane, 'aggressive');
            if (score > bestScore) {
                bestScore = score;
                bestPlane = plane;
            }
        });

        return bestPlane;
    }

    /**
     * Finds the safest plane (for easy difficulty)
     * @param planeList Array of eligible planes
     * @returns {jQuery} The safest plane to move
     */
    function findSafestPlane(planeList) {
        var bestScore = -1;
        var bestPlane = planeList[0];

        planeList.forEach(function(plane) {
            var score = evaluatePlanePosition(plane, 'passive');
            if (score > bestScore) {
                bestScore = score;
                bestPlane = plane;
            }
        });

        return bestPlane;
    }

    /**
     * Evaluates a plane's position based on strategy
     * @param plane The plane to evaluate
     * @param strategy 'aggressive' or 'passive'
     * @returns {number} Score indicating how good the position is
     */
    function evaluatePlanePosition(plane, strategy) {
        var score = 0;
        var currentPos = plane.attr('coordid');

        // Base case for planes that haven't started
        if (!currentPos) {
            if (planeOption.canTakeOff(diceNum)) {
                return strategy === 'aggressive' ? 100 : 50; // Both strategies value getting planes out
            }
            return 0;
        }

        // Check all other planes on the board
        $j('.plane').each(function() {
            if ($j(this).attr('type') !== planeOption.currentUser) {
                var targetPos = $j(this).attr('coordid');
                if (targetPos) {
                    var distance = Math.abs(parseInt(currentPos) - parseInt(targetPos));
                    if (strategy === 'aggressive') {
                        // Aggressive scoring - prefer positions close to opponents
                        if (distance <= diceNum) {
                            score += 50; // Can capture
                        } else if (distance <= 6) {
                            score += (6 - distance) * 5; // Close to capture
                        }
                    } else {
                        // Passive scoring - prefer positions far from opponents
                        if (distance <= diceNum) {
                            score -= 50; // Avoid possible capture positions
                        } else if (distance <= 6) {
                            score += distance * 5; // Prefer being further away
                        } else {
                            score += 40; // Bonus for being far from others
                        }
                    }
                }
            }
        });

        // Add some randomness for passive strategy to make it less predictable
        if (strategy === 'passive') {
            score += Math.random() * 10;
        }

        return score;
    }

    /**
     * 执行下一步
     */
    function diceClick() {
        var nextSt = setTimeout(function () {
            if (nextStep) {
                $j("#dice").click();
                clearTimeout(nextSt);
                return;
            } else {
                diceClick();
            }
        }, 500);
    }

    /**
     * 根据长度均衡获取0,0-1,0-2,0-3的随机整数
     * @param leng  长度
     * @returns {*}
     */
    function obtainRandomNum(leng) {
        var num = Math.floor(Math.random() * 10);//均衡获取0-9的随机整数
        switch (leng) {
            case 1:
                return 0;
                break;
            case 2:
                if (num == 0 || num == 1) {
                    return num;
                } else {
                    return obtainRandomNum(leng);
                }
                break;
            case 3:
                if (num == 0 || num == 1 || num == 2) {
                    return num;
                } else {
                    return obtainRandomNum(leng);
                }
                break;
            case 4:
                if (num == 0 || num == 1 || num == 2 || num == 3) {
                    return num;
                } else {
                    return obtainRandomNum(leng);
                }
                break;
        }
    }
};
var computer = new Computer();